import { filter, find, forEach, map } from 'lodash-es';

import { IStore } from '../app/types';
import { createBreakoutRoom, removeBreakoutRoom, sendParticipantToRoom } from '../breakout-rooms/actions';
import { getBreakoutRooms } from '../breakout-rooms/functions';
import logger from '../breakout-rooms/logger';
import { getVisitorsList } from '../visitors/functions';

import { _AVAILABLE_TO_SET_BREAKOUT_ROOMS, _ENABlE_PRESET_BREAKOUT_ROOMS, _PRESET_BREAKOUT_ROOMS_ADD_LISTENER, _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER, _UPDATE_PRESET_BREAKOUT_ROOMS } from './actionTypes';
import { getAllParticipants, getPresetBreakoutRoomData } from './functions';
import type { IBreakoutPayload, IMessageData } from './types';

export function enablePresetFeature(value: boolean) {
    return {
        type: _ENABlE_PRESET_BREAKOUT_ROOMS,
        payload: value
    };
}

export function updatePresetBreakoutRoom(data: IBreakoutPayload) {
    return {
        type: _UPDATE_PRESET_BREAKOUT_ROOMS,
        payload: data
    };
}

export function retrievePresetBreakoutRoom() {
    return (dispatch: IStore['dispatch'], _getState: IStore['getState']) => {
        window.opener.postMessage({ type: 'Request-MeetingBreakoutRoomParams' }, '*');
        let messageListener: ((event: MessageEvent<IMessageData<IBreakoutPayload>>) => void) | undefined = async (
                event: MessageEvent<IMessageData>
        ) => {
            const { type: msgType, payload } = event.data ?? {};

            if (msgType === 'Response-MeetingBreakoutRoomParams') {
                logger.debug('[GTS-PBR] getBreakoutConfig data', payload);

                dispatch({
                    type: _UPDATE_PRESET_BREAKOUT_ROOMS,
                    payload: payload
                });

                event.source?.postMessage({ type: 'Received-MeetingBreakoutRoomParams' }, { targetOrigin: event.origin });

                dispatch({
                    type: _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER
                });
            }
        };

        window.addEventListener('message', messageListener);
        const clean = () => {
            if (!messageListener) {
                return;
            }
            window.removeEventListener('message', messageListener);
            messageListener = undefined;
        };

        dispatch({
            type: _PRESET_BREAKOUT_ROOMS_ADD_LISTENER,
            payload: clean
        });
    };
}

export function cleanListener() {
    return {
        type: _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER
    };
}

export function availableToSetup(value: boolean) {
    return {
        type: _AVAILABLE_TO_SET_BREAKOUT_ROOMS,
        payload: value
    };
}

export function prepareBreakoutRoom() {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const toCleanSubRooms = filter(getBreakoutRooms(getState), room => !room.isMainRoom);
        const visitorsList = getVisitorsList(getState);
        const { meetingData } = getPresetBreakoutRoomData(getState);

        logger.debug('[GTS-PBR] prepareBreakoutRoom', { rooms: toCleanSubRooms, meetingData, visitorsList });

        await Promise.all(map(toCleanSubRooms, room => dispatch(removeBreakoutRoom(room.jid))));
        logger.debug('[GTS-PBR] removeBreakoutRoom completed：', toCleanSubRooms.map(room => room.name));

        await Promise.all(map(filter(meetingData, meetingRoom => !meetingRoom.isMainRoom), meetingRoom => dispatch(createBreakoutRoom(meetingRoom.name))));
        logger.debug('[GTS-PBR] createBreakoutRooms ALL completed');

        dispatch(availableToSetup(true));
    };
}

export function executeBreakoutRoom() {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { meetingData } = getPresetBreakoutRoomData(getState);
        const allParticipants = getAllParticipants(getState);

        dispatch(availableToSetup(false));

        // even if waiting for the middleware callback, it still takes some time to obtain the current room information.
        await new Promise(resolve => setTimeout(resolve, 666));
        const newRooms = getBreakoutRooms(getState);

        forEach(meetingData, meetingRoom => {
            const { name, participants: members } = meetingRoom;
            const room = find(newRooms, roomItem => roomItem.name === name);

            if (!room) {
                return;
            }

            forEach(members, member => {
                const participant = find(allParticipants, participantItem => {
                    if (participantItem.iDigestId) {
                        return `${participantItem.iDigestId}` === `${member.userId}`;
                    }

                    return participantItem.name === member.name;
                });

                if (participant) {
                    dispatch(sendParticipantToRoom(participant.id, room.id));
                    logger.debug(`[GTS-PBR] send [${participant.name ?? participant.displayName}]  To Room-{${room.name}}`, { participant, room });
                }
            });
        });
    };
}
