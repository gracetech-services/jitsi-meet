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
 * Map of safety net timers, keyed by room ID.
 * Stores timeout ID and the expiresAt value that was used to arm the timer,
 * so that if the moderator updates the duration, the timer is re-armed.
 *
 * @type {Map<string, { timerId: ReturnType<typeof setTimeout>, expiresAt: number }>}
 */
const roomTimers = new Map<string, { expiresAt: number; timerId: ReturnType<typeof setTimeout>; }>();

/**
 * Arms safety net timers for all breakout rooms that have an expiresAt.
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
    const currentRoomIds = new Set<string>();

    Object.values(rooms ?? {}).forEach((room: IRoom) => {
        // Skip the main room and rooms with no timeout settings
        if (!room.expiresAt || room.isMainRoom) {
            return;
        }

        currentRoomIds.add(room.id);

        // the existing timer and re-arm when expiresAt changes,
        const existing = roomTimers.get(room.id);

        if (existing && existing.expiresAt === room.expiresAt) {
            return;
        }

        // Clear the old timer and re-arm when expiresAt changes
        if (existing) {
            clearTimeout(existing.timerId);
            roomTimers.delete(room.id);
            logger.debug(`[GTS-SN] Re-arming timer for room ${room.id} (expiresAt changed)`);
        }

        const delay = room.expiresAt + SAFETY_GRACE_MS - Date.now();

        // Guard against NaN/Infinity (invalid expiresAt or clock anomaly), execute removeBreakoutRoom immediately
        if (!Number.isFinite(delay) || delay <= 0) {
            // Immediately dispatch removeBreakoutRoom for expired rooms
            dispatch(removeBreakoutRoom(room.jid));

            return;
        }

        const timerId = setTimeout(() => {
            roomTimers.delete(room.id);
            if (!isLocalParticipantModerator(getState())) {
                logger.debug(`[GTS-SN] Skipping close for room ${room.id} — no longer moderator`);

                return;
            }
            dispatch(removeBreakoutRoom(room.jid));
        }, delay);

        roomTimers.set(room.id, { timerId, expiresAt: room.expiresAt });
        logger.debug(`[GTS-SN] Armed safety net for room ${room.id}, delay=${delay}ms`);
    });

    // Clear the timer when the room disappears from the state
    for (const roomId of roomTimers.keys()) {
        if (!currentRoomIds.has(roomId)) {
            clearTimeout(roomTimers.get(roomId)?.timerId);
            roomTimers.delete(roomId);
            logger.debug(`[GTS-SN] Cleared timer for removed room ${roomId}`);
        }
    }
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
        if (!conference && roomTimers.size > 0) {
            for (const entry of roomTimers.values()) {
                clearTimeout(entry.timerId);
            }
            roomTimers.clear();
            logger.debug('[GTS-SN] Cleared all timers (conference ended)');
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
