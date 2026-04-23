import { find } from 'lodash-es';

import { MODERATION_NOTIFICATIONS, MediaType } from '../av-moderation/constants';
import { IStateful } from '../base/app/types';
import { IParticipant } from '../base/participants/types';
import { toState } from '../base/redux/functions';

/**
 * Tells whether or not the notifications are enabled and if there are any
 * notifications to be displayed based on the current Redux state.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export function areThereNotifications(stateful: IStateful) {
    const state = toState(stateful);
    const { enabled, notifications } = state['features/notifications'];

    return enabled && notifications.length > 0;
}

/**
 * Tells whether join/leave notifications are enabled in interface_config.
 *
 * @returns {boolean}
 */
export function joinLeaveNotificationsDisabled() {
    return Boolean(typeof interfaceConfig !== 'undefined' && interfaceConfig?.DISABLE_JOIN_LEAVE_NOTIFICATIONS);
}

/**
 * Returns whether or not the moderation notification for the given type is displayed.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export function isModerationNotificationDisplayed(mediaType: MediaType, stateful: IStateful) {
    const state = toState(stateful);

    const { notifications } = state['features/notifications'];

    return Boolean(notifications.find(n => n.uid === MODERATION_NOTIFICATIONS[mediaType]));
}

/**
 * Tells whether or not the participant participant is joining from a breakout room.
 *
 * @param {IParticipant} participant - The participant to check.
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
export function isJoinFromBreakoutRoom(participant: IParticipant, stateful: IStateful): boolean {
    const state = toState(stateful);

    const { breakoutRoomParticipants } = state['features/notifications'];

    const _isJoinFromBreakoutRoom = !!find(breakoutRoomParticipants, { displayName: participant.name });

    return _isJoinFromBreakoutRoom;
}
