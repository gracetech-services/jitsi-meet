import { IStore } from '../app/types';
import { getCurrentConference } from '../base/conference/functions';
import { CONNECTION_ESTABLISHED } from '../base/connection/actionTypes';
import { isLocalParticipantModerator } from '../base/participants/functions';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';

import { removeBreakoutRoom } from './actions';
import { FEATURE_KEY, SAFETY_GRACE_MS } from './constants';
import { getBreakoutRooms } from './functions';
import logger from './logger';
import { IRoom } from './types';

/**
 * Singleton Timer for Safety Net.
 * In the global timer mode, all sub-rooms with expiresAt share the same expiresAt value,
and only one setTimeout is needed to handle the expiration of all timed rooms.
 *
 */
let safetyTimer: { expiresAt: number; timerId: ReturnType<typeof setTimeout>; } | null = null;

/**
 * Arms safety net timer for the global expiresAt.
 * Called by both the StateListenerRegistry subscriber and the
 * CONNECTION_ESTABLISHED middleware handler.
 *
 * Each moderator client runs this independently.
 * RemoveBreakoutRoom is idempotent — duplicate triggers are safe.
 *
 * @returns {void}
 */
function _armSafetyNet({ dispatch, getState }: IStore) {
    if (!isLocalParticipantModerator(getState())) {
        return;
    }

    const rooms = getBreakoutRooms(getState());
    // Get the first non-main room with expiresAt
    const timedRoom = Object.values(rooms).find((room: IRoom) => !room.isMainRoom && room.expiresAt);

    if (!timedRoom?.expiresAt) {
        // No timed rooms, clear the existing timer if it exists
        if (safetyTimer) {
            clearTimeout(safetyTimer.timerId);
            safetyTimer = null;
            logger.debug('[GTS-SN] Cleared timer (no timed rooms)');
        }

        return;
    }

    // No need to re-arm the timer if expiresAt hasn't changed
    if (safetyTimer && safetyTimer.expiresAt === timedRoom.expiresAt) {
        return;
    }

    // Clear the existing timer if it exists
    if (safetyTimer) {
        clearTimeout(safetyTimer.timerId);
        logger.debug('[GTS-SN] Re-arming timer (expiresAt changed)');
    }

    const delay = timedRoom.expiresAt + SAFETY_GRACE_MS - Date.now();

    if (!Number.isFinite(delay) || delay <= 0) {
        // Immediately close all timed rooms
        Object.values(rooms).forEach((room: IRoom) => {
            if (!room.isMainRoom && room.expiresAt) {
                dispatch(removeBreakoutRoom(room.jid));
            }
        });

        return;
    }

    const timerId = setTimeout(() => {
        safetyTimer = null;
        if (!isLocalParticipantModerator(getState())) {
            logger.debug('[GTS-SN] Skipping close — no longer moderator');

            return;
        }
        // Close all timed rooms
        const currentRooms = getBreakoutRooms(getState());

        Object.values(currentRooms).forEach((room: IRoom) => {
            if (!room.isMainRoom && room.expiresAt) {
                dispatch(removeBreakoutRoom(room.jid));
            }
        });
    }, delay);

    safetyTimer = { timerId, expiresAt: timedRoom.expiresAt };
    logger.debug(`[GTS-SN] Armed safety net, delay=${delay}ms`);
}

/**
 * Registers a StateListenerRegistry subscriber that monitors rooms state.
 * When rooms change, _armSafetyNet evaluates all rooms with expiresAt
 * and sets or clears timers accordingly.
 */
StateListenerRegistry.register(
    state => state[FEATURE_KEY].rooms,
    (rooms, store) => {
        _armSafetyNet(store);
    }
);

/**
 * Clears all safety net timers when the conference becomes null
 * (user leaves the conference). Prevents timer callbacks from
 * dispatching actions in an invalid conference context.
 */
StateListenerRegistry.register(
    state => getCurrentConference(state),
    conference => {
        if (!conference && safetyTimer) {
            clearTimeout(safetyTimer.timerId);
            safetyTimer = null;
            logger.debug('[GTS-SN] Cleared timer (conference ended)');
        }
    }
);

/**
 * Monitors the local participant's moderator status.
 * When a participant is promoted to moderator while breakout rooms with
 * expiresAt already exist, arms the safety net immediately rather than
 * waiting for the next room state update.
 */
StateListenerRegistry.register(
    state => isLocalParticipantModerator(state),
    (isModerator, store) => {
        if (isModerator) {
            _armSafetyNet(store);
        }
    }
);

/**
 * Middleware that handles CONNECTION_ESTABLISHED to re-arm safety net timers
 * after a moderator reconnects. This ensures no room is left unmonitored
 * after a connection drop and re-establishment.
 */
MiddlewareRegistry.register(store => next => action => {
    if (action.type === CONNECTION_ESTABLISHED) {
        _armSafetyNet(store);
    }

    return next(action);
});
