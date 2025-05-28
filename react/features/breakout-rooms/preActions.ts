import i18next from 'i18next';

import { IStore } from '../app/types';
import { fishMeetPassInData } from '../base/config/FishMeetPassInData';
import { getLocalParticipant, getRemoteParticipants } from '../base/participants/functions';

import { UPDATE_BREAKOUT_ROOMS } from './actionTypes';
import {
    AllRoomsData, IParticipant,
    addParticipantToRoom, distributeParticipantsEvenly,
    getAllRoomsData, getPreMainRoom, isEmailInAnyRoom,
    isParticipantInRoom, removeParticipantFromRoom,
    removeRoom, setAllRoomsData, updateRoomData
} from './preRoomData';


let roomIndexCounter = 1;

/**
 * Action to creating a preloaded room.
 *
 * @param {string} name - Room name.
 * @param {boolean} isMainRoom - IsMain room.
 * @returns {Function}
 */
export function createPreloadBreakoutRoom(name?: string, isMainRoom?: boolean) {
    return (dispatch: IStore['dispatch']) => {
        const allRooms = Object.values(getAllRoomsData());
        const index = roomIndexCounter++;
        const roomName = name || i18next.t('breakoutRooms.defaultName', { index });

        updateRoomData(undefined, {
            name: roomName,
            isMainRoom: isMainRoom ?? false,
            participants: {}
        });

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms: { ...getAllRoomsData() },
            roomCounter: allRooms.filter(room => !room.isMainRoom).length + 1
        });
    };
}


/**
 * Action to remove preloaded rooms.
 *
 * @param {string} roomId - Room roomId.
 * @returns {Function}
 */
export function removePreloadBreakoutRoom(roomId: string) {
    return (dispatch: IStore['dispatch']) => {

        removeRoom(roomId);
        const roomCounter = Object.keys(getAllRoomsData()).length;
        const rooms = { ...getAllRoomsData() };

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms,
            roomCounter
        });
    };
}

/**
 * Action to add participants to the main meeting room.
 *
 * @returns {Function}
 */
export function addParticipantToPreloadMainRoom() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();

        setAllRoomsData({});

        // Get local participants, that is yourself
        const localParticipant = getLocalParticipant(state);

        // Get remote participants
        const remoteParticipants = getRemoteParticipants(state);


        // If you do not assign a value to this name,
        // the default is the localization of the main conference name.
        updateRoomData('fishmeet-main-room', {
            isMainRoom: true,
            participants: {}
        });
        const mainRoomId = getPreMainRoom()?.id;


        // Add local participants and remote participants
        // to the preloaded data structure
        if (mainRoomId) {
            addParticipantToRoom(mainRoomId, {
                displayName: localParticipant?.name,
                role: 'moderator',
                jid: localParticipant?.id,
                isSelected: false,
                isNotInMeeting: false,
                email: localParticipant?.email
            });
            for (const [, participant] of remoteParticipants) {
                addParticipantToRoom(mainRoomId, {
                    displayName: participant?.name,
                    role: 'participant',
                    jid: participant?.id,
                    isSelected: false,
                    isNotInMeeting: false,
                    email: participant.email
                });
            }
        }

        const roomCounter = Object.keys(getAllRoomsData()).length;
        const rooms = { ...getAllRoomsData() };

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms,
            roomCounter
        });
    };
}

/**
 * Action to addParticipantToPreloadRoom.
 *
 * @param {string} roomId - Room roomId.
 * @param {IParticipant} selectParticipants - SelectParticipants.
 * @returns {Function}
 */
export function addParticipantToPreloadRoom(roomId: string, selectParticipants: IParticipant[]) {
    return (dispatch: IStore['dispatch']) => {

        for (const item of selectParticipants) {
            if (item.isSelected) {
                addParticipantToRoom(roomId, item);
            } else if (isParticipantInRoom(roomId, item.jid)) {
                const mainRoom = getPreMainRoom();

                if (mainRoom) {
                    addParticipantToRoom(mainRoom.id, item);
                    removeParticipantFromRoom(roomId, item.jid);
                }
            }
        }

        const roomCounter = Object.keys(getAllRoomsData()).length;
        const rooms = JSON.parse(JSON.stringify(getAllRoomsData()));

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms,
            roomCounter
        });
    };

}

/**
 * Action to autoPreAssignToBreakoutRooms.
 *
 * @returns {Function}
 */
export function autoPreAssignToBreakoutRooms() {
    return (dispatch: IStore['dispatch']) => {
        distributeParticipantsEvenly();
        const roomCounter = Object.keys(getAllRoomsData()).length;
        const rooms = JSON.parse(JSON.stringify(getAllRoomsData()));

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms,
            roomCounter
        });
    };
}

/**
 * Action to setLoadPreBreakoutRooms.
 * Set preloaded room data.
 *
 * @param {Object} meetingData - Room roomId.
 * @returns {Function}
 */
export function setLoadPreBreakoutRooms(meetingData: any) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const remoteParticipants = getRemoteParticipants(state);

        Object.keys(meetingData).forEach(roomId => {
            const room = meetingData[roomId];

            Object.keys(room.participants).forEach(participantId => {
                const participant = room.participants[participantId];

                // We need to determine whether the current participant is actually in the meeting.
                // Since the participant's ID is different each time a meeting is started,
                // we use the participant's email to make the judgment.
                participant.isNotInMeeting = !isInMeeting(remoteParticipants, participant.email);
            });
        });

        setAllRoomsData(meetingData as AllRoomsData);

        Object.entries(remoteParticipants).forEach(([id, participant]) => {
            const email = participant.email ?? '';

            if (!isEmailInAnyRoom(email)) {
                const mainRoomId = getPreMainRoom()?.id;

                if (mainRoomId) {
                    addParticipantToRoom(mainRoomId, {
                        displayName: participant.name ?? 'Unknown',
                        role: 'participant' as const,
                        jid: id,
                        isSelected: false,
                        isNotInMeeting: false,
                        email
                    });
                }
            }
        });

        const roomCounter = Object.keys(getAllRoomsData()).length;
        const rooms = { ...getAllRoomsData() };

        dispatch({
            type: UPDATE_BREAKOUT_ROOMS,
            rooms,
            roomCounter
        });
    };
}

/**
 * Action to IsInMeeting.
 * Determine whether participants are in the meeting through email.
 *
 * @param {any} participantsMap - ParticipantsMap.
 * @param {string} targetEmail - TargetEmail.
 * @returns {Function}
 */
function isInMeeting(participantsMap: any, targetEmail: string) {

    if (targetEmail === fishMeetPassInData.email) {
        return true;
    }
    for (const participant of participantsMap.values()) {
        if (participant.email === targetEmail) {
            return true;
        }
    }

    return false;
}


