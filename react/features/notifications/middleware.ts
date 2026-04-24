import { throttle, values } from 'lodash-es';

import { IReduxState, IStore } from '../app/types';
import { getCurrentConference } from '../base/conference/functions';
import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_UPDATED
} from '../base/participants/actionTypes';
import { PARTICIPANT_ROLE } from '../base/participants/constants';
import {
    getLocalParticipant,
    getParticipantById,
    getParticipantDisplayName,
    isScreenShareParticipant,
    isWhiteboardParticipant
} from '../base/participants/functions';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import type { IRooms } from '../breakout-rooms/types';
import { PARTICIPANTS_PANE_OPEN } from '../participants-pane/actionTypes';

import {
    CLEAR_NOTIFICATIONS,
    HIDE_NOTIFICATION,
    SHOW_NOTIFICATION
} from './actionTypes';
import {
    clearNotifications,
    hideNotification,
    setBreakoutRoomParticipant,
    showNotification,
    showParticipantJoinedNotification,
    showParticipantLeftNotification
} from './actions';
import {
    NOTIFICATION_TIMEOUT_TYPE,
    RAISE_HAND_NOTIFICATION_ID
} from './constants';
import { areThereNotifications, isJoinFromBreakoutRoom, joinLeaveNotificationsDisabled } from './functions';
import logger from './logger';

/**
 * Map of timers.
 *
 * @type {Map}
 */
const timers = new Map();

/**
 * Function that creates a timeout id for specific notification.
 *
 * @param {Object} notification - Notification for which we want to create a timeout.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {void}
 */
const createTimeoutId = (notification: { timeout: number; uid: string; }, dispatch: IStore['dispatch']) => {
    const {
        timeout,
        uid
    } = notification;

    if (timeout) {
        const timerID = setTimeout(() => {
            dispatch(hideNotification(uid));
        }, timeout);

        timers.set(uid, timerID);
    }
};

/**
 * Returns notifications state.
 *
 * @param {Object} state - Global state.
 * @returns {Array<Object>} - Notifications state.
 */
const getNotifications = (state: IReduxState) => {
    const _visible = areThereNotifications(state);
    const { notifications } = state['features/notifications'];

    return _visible ? notifications : [];
};

/**
 * Middleware that captures actions to display notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    const { dispatch, getState } = store;
    const state = getState();

    switch (action.type) {
    case CLEAR_NOTIFICATIONS: {
        const _notifications = getNotifications(state);

        for (const notification of _notifications) {
            if (timers.has(notification.uid)) {
                const timeout = timers.get(notification.uid);

                clearTimeout(timeout);
                timers.delete(notification.uid);
            }
        }
        timers.clear();
        break;
    }
    case SHOW_NOTIFICATION: {
        if (timers.has(action.uid)) {
            const timer = timers.get(action.uid);

            clearTimeout(timer);
            timers.delete(action.uid);
        }

        createTimeoutId(action, dispatch);
        break;
    }
    case HIDE_NOTIFICATION: {
        const timer = timers.get(action.uid);

        clearTimeout(timer);
        timers.delete(action.uid);
        break;
    }
    case PARTICIPANT_JOINED: {
        const result = next(action);
        const { participant: p } = action;
        const { conference } = state['features/base/conference'];

        // Do not display notifications for the virtual screenshare and whiteboard tiles.
        if (conference
            && !p.local
            && !isScreenShareParticipant(p)
            && !isWhiteboardParticipant(p)
            && !joinLeaveNotificationsDisabled()
            && !isJoinFromBreakoutRoom(p, state)
            && !p.isReplacing) {
            dispatch(showParticipantJoinedNotification(
                getParticipantDisplayName(state, p.id)
            ));
        }

        return result;
    }
    case PARTICIPANT_LEFT: {
        if (!joinLeaveNotificationsDisabled()) {
            const participant = getParticipantById(
                store.getState(),
                action.participant.id
            );

            // Do not display notifications for the virtual screenshare tiles.
            if (participant
                && !participant.local
                && !isScreenShareParticipant(participant)
                && !isWhiteboardParticipant(participant)
                && !action.participant.isReplaced) {
                dispatch(showParticipantLeftNotification(
                    getParticipantDisplayName(state, participant.id)
                ));
            }
        }

        return next(action);
    }
    case PARTICIPANT_UPDATED: {
        const { disableModeratorIndicator } = state['features/base/config'];

        if (disableModeratorIndicator) {
            return next(action);
        }

        const { id, role } = action.participant;
        const localParticipant = getLocalParticipant(state);

        if (localParticipant?.id !== id) {
            return next(action);
        }

        const oldParticipant = getParticipantById(state, id);
        const oldRole = oldParticipant?.role;

        if (oldRole && oldRole !== role && role === PARTICIPANT_ROLE.MODERATOR) {

            store.dispatch(showNotification({
                titleKey: 'notify.moderator'
            },
            NOTIFICATION_TIMEOUT_TYPE.SHORT));
        }

        return next(action);
    }
    case PARTICIPANTS_PANE_OPEN: {
        store.dispatch(hideNotification(RAISE_HAND_NOTIFICATION_ID));
        break;
    }
    }

    return next(action);
});

/**
 * StateListenerRegistry provides a reliable way to detect the leaving of a
 * conference, where we need to clean up the notifications.
 */
StateListenerRegistry.register(
    /* selector */ state => getCurrentConference(state),
    /* listener */ (conference, { dispatch }) => {
        if (!conference) {
            dispatch(clearNotifications());
        }
    }
);

/**
 * StateListenerRegistry provides a reliable way to detect the breakout rooms updated event,
 * where we need to update the breakout room participants.
 */
StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    (conference, { dispatch }, previousConference) => {
        if (conference && !previousConference) {
            conference.on(JitsiConferenceEvents.BREAKOUT_ROOMS_UPDATED, throttle((params: { rooms: IRooms; }) => {
                const { rooms } = params;
                const breakoutRoomParticipants = values(rooms).filter(room => !room.isMainRoom).reduce((acc, room) => ({
                    ...acc,
                    ...room?.participants
                }), {});

                logger.debug('[GTS] notifications Room Updated:', {
                    rooms,
                    breakoutRoomParticipants
                });

                dispatch(setBreakoutRoomParticipant(breakoutRoomParticipants));
            }, 3000, {
                leading: false,
                trailing: true
            }));
        }
    });
