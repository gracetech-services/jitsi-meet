import { filter, find, forEach, map } from 'lodash-es';

import { IStore } from '../app/types';
import { getLocalParticipant, getRemoteParticipants } from '../base/participants/functions';
import { createBreakoutRoom, removeBreakoutRoom, sendParticipantToRoom } from '../breakout-rooms/actions';
import { getBreakoutRooms } from '../breakout-rooms/functions';
import { getVisitorsList } from '../visitors/functions';

import { _ENABlE_PRESET_BREAKOUT_ROOMS, _PRESET_BREAKOUT_ROOMS_ADD_LISTENER, _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER, _UPDATE_PRESET_BREAKOUT_ROOMS } from './actionTypes';
import { getPresetBreakoutRoomData } from './functions';
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
                console.log('[GTS-PBR] getBreakoutConfig data', payload);

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

export function setPresetBreakoutRoom() {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const rooms = getBreakoutRooms(getState);
        const visitorsList = getVisitorsList(getState);
        const presetBreakoutRoomData = getPresetBreakoutRoomData(getState);
        const participants = getRemoteParticipants(getState);
        const localParticipant = getLocalParticipant(getState);

        const allParticipants = [ ...participants ].map(([ _id, participant ]) => participant);

        if (localParticipant) {
            allParticipants.push(localParticipant);
        }

        console.log('[GTS-PBR] setPresetBreakoutRoom', { rooms, presetBreakoutRoomData, visitorsList, participants });

        await Promise.all(map(rooms, room => dispatch(removeBreakoutRoom(room.jid))));
        console.log('[GTS-PBR] removeBreakoutRoom completed');

        await Promise.all(map(filter(presetBreakoutRoomData.meetingData, meetingRoom => !meetingRoom.isMainRoom), meetingRoom => dispatch(createBreakoutRoom(meetingRoom.name))));
        console.log('[GTS-PBR] createBreakoutRooms ALL completed');

        // Todo: Establish an asynchronous listener from CONFERENCE_JOINED to trigger the reallocation of personnel
        setTimeout(() => {
            const newRooms = getBreakoutRooms(getState);

            console.log('[GTS-PBR] getBreakoutRooms After Recreate', { newRooms, allParticipants, presetBreakoutRoomData });

            forEach(presetBreakoutRoomData.meetingData, meetingRoom => {
                const { name, participants: members } = meetingRoom;
                const room = find(newRooms, item => item.name === name);

                if (!room) {
                    return;
                }

                forEach(members, member => {
                    const participant = find(allParticipants, item => item.name === member.name);

                    if (participant) {
                        dispatch(sendParticipantToRoom(participant.id, room.id));
                        console.log('[GTS-PBR] sendParticipantToRoom', { participant, room });
                    }
                });
            });
        }, 1000 * 3);

    };
}
