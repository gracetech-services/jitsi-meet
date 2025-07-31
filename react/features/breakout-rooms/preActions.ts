import i18next from 'i18next';

import { IStore } from '../app/types';
import { getLocalParticipant, getRemoteParticipants } from '../base/participants/functions';

import { UPDATE_BREAKOUT_ROOMS } from './actionTypes';
import {
    AllRoomsData, IParticipant,
    addParticipantToRoom,
    distributeParticipantsEvenly, getAllRoomsData,
    getPreMainRoom, isParticipantInRoom, isUserIdInAnyRoom,
    removeParticipantFromRoom, removeRoom,
    removeRoomAllParticipants, sendParticipantToRoom, setAllRoomsData, updateRoomData
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
                isSelected: false,
                isNotInMeeting: false,
                userId: localParticipant?.userId,
                isGroupLeader: 1
            });

            for (const [ , participant ] of remoteParticipants) {
                addParticipantToRoom(mainRoomId, {
                    displayName: participant?.name,
                    role: 'participant',
                    isSelected: false,
                    isNotInMeeting: false,
                    userId: participant?.userId,
                    isGroupLeader: 0
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
                const { jid: _jid, ...participantWithoutJid } = item;

                addParticipantToRoom(roomId, participantWithoutJid);
            } else if (isParticipantInRoom(roomId, item.jid)) {
                const mainRoom = getPreMainRoom();

                if (mainRoom) {
                    const { jid: _jid, ...participantWithoutJid } = item;

                    addParticipantToRoom(mainRoom.id, participantWithoutJid);
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

        const currentRooms = getAllRoomsData();
        const renamedRooms: { [key: string]: string; } = {};

        Object.keys(currentRooms).forEach(roomId => {
            const room = currentRooms[roomId];

            if (room.name && room.name !== i18next.t('breakoutRooms.defaultName', { index: roomId })) {
                renamedRooms[roomId] = room.name;
            }
        });

        Object.keys(meetingData).forEach(roomId => {
            const room = meetingData[roomId];

            Object.keys(room.participants).forEach(participantId => {
                const participant = room.participants[participantId];

                // regenerate jid
                if (!participant.jid) {
                    participant.jid = participant.userId || participantId;
                }

                // check if user is in meeting
                if (participant.isNotInMeeting === undefined) {
                    participant.isNotInMeeting = !checkIfUserIsInMeeting(participant, getState);
                }

                // set selected state
                if (participant.isSelected === undefined) {
                    participant.isSelected = false;
                }

                // set role based on isGroupLeader
                if (participant.role === undefined) {
                    participant.role = participant.isGroupLeader === 1 ? 'moderator' : 'participant';
                }
            });

            if (renamedRooms[roomId]) {
                room.name = renamedRooms[roomId];
            }
        });

        setAllRoomsData(meetingData as AllRoomsData);

        Object.entries(remoteParticipants).forEach(([ _id, participant ]) => {
            const userId = participant.userId ?? '';

            if (!isUserIdInAnyRoom(userId)) {
                const mainRoomId = getPreMainRoom()?.id;

                if (mainRoomId) {
                    addParticipantToRoom(mainRoomId, {
                        displayName: participant.name ?? 'Unknown',
                        role: 'participant' as const,
                        isSelected: false,
                        isNotInMeeting: false,
                        userId: participant?.userId,
                        isGroupLeader: 0
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
 * Action to moveLocalParticipantToPreloadRoom.
 *
 * @param {string} roomId - Room roomId.
 * @returns {Function}
 */
export function moveLocalParticipantToPreloadRoom(roomId: string) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const localParticipant = getLocalParticipant(state);
        const participantJid = localParticipant?.id;

        if (participantJid) {
            sendParticipantToRoom(roomId, participantJid);
            const roomCounter = Object.keys(getAllRoomsData()).length;
            const rooms = JSON.parse(JSON.stringify(getAllRoomsData()));

            dispatch({
                type: UPDATE_BREAKOUT_ROOMS,
                rooms,
                roomCounter
            });
        }
    };
}

/**
 * Action to sendParticipantToPreloadRoom.
 *
 * @param {string} roomId - Room roomId.
 * @param {string} participantJid - ParticipantJid.
 * @returns {Function}
 */
export function sendParticipantToPreloadRoom(roomId: string, participantJid: string) {
    return (dispatch: IStore['dispatch']) => {

        sendParticipantToRoom(roomId, participantJid);
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
 * Action to remove room's all particiants.
 *
 * @param {string} roomId - Room roomId.
 * @returns {Function}
 */
export function removeParticipantsFromPreloadBreakoutRoom(roomId: string) {
    return (dispatch: IStore['dispatch']) => {

        removeRoomAllParticipants(roomId);
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
 * Action to rename a preload breakout room.
 *
 * @param {string} roomId - Room roomId.
 * @param {string} name - New room name.
 * @returns {Function}
 */
export function renamePreloadBreakoutRoom(roomId: string, name: string) {
    return (dispatch: IStore['dispatch']) => {
        updateRoomData(roomId, { name });

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
 * Check if a user is currently in the meeting.
 *
 * @param {IParticipant} participant - The participant to check.
 * @param {Function} getState - Function to get the current state.
 * @returns {boolean} True if the user is in the meeting, false otherwise.
 */
function checkIfUserIsInMeeting(participant: IParticipant, getState: IStore['getState']): boolean {
    const state = getState();
    const localParticipant = getLocalParticipant(state);
    const remoteParticipants = getRemoteParticipants(state);

    if (localParticipant && (localParticipant.userId === participant.userId)) {
        return true;
    }

    for (const [ , remoteParticipant ] of remoteParticipants) {
        if (remoteParticipant.userId === participant.userId) {
            return true;
        }
    }

    return false;
}
