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
 * Stores timeout IDs so they can be cleared on room removal or conference end.
 *
 * @type {Map<string, ReturnType<typeof setTimeout>>}
 */
const roomTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Arms safety net timers for all breakout rooms that have an expiresAt.
 * Called by both the StateListenerRegistry subscriber and the
 * CONNECTION_ESTABLISHED middleware handler.
 *
 * Each moderator client runs this independently.
 * RemoveBreakoutRoom is idempotent — duplicate triggers are safe..
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

        // Skip if timer already exists (de-duplication)
        if (roomTimers.has(room.id)) {
            return;
        }

        // setTimeout 延迟 = expiresAt + SAFETY_GRACE_MS - Date.now()
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

        roomTimers.set(room.id, timerId);
        logger.debug(`[GTS-SN] Armed safety net for room ${room.id}, delay=${delay}ms`);
    });

    // 房间从 state 消失时清除定时器
    for (const roomId of roomTimers.keys()) {
        if (!currentRoomIds.has(roomId)) {
            clearTimeout(roomTimers.get(roomId)!);
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
            for (const timerId of roomTimers.values()) {
                clearTimeout(timerId);
            }
            roomTimers.clear();
            logger.debug('[GTS-SN] Cleared all timers (conference ended)');
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
