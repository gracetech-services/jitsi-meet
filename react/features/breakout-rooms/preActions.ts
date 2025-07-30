import i18next from 'i18next';

import { IStore } from '../app/types';
import { fishMeetPassInData } from '../base/config/FishMeetPassInData';
import { getLocalParticipant, getRemoteParticipants } from '../base/participants/functions';

import { UPDATE_BREAKOUT_ROOMS } from './actionTypes';
import {
    AllRoomsData, IParticipant,
    addParticipantToRoom,
    distributeParticipantsEvenly, getAllRoomsData,
    getPreMainRoom, isUserIdInAnyRoom, isParticipantInRoom,
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
            console.log('🔧 Adding local participant to preload main room:', {
                displayName: localParticipant?.name,
                userId: localParticipant?.userId
            });

            addParticipantToRoom(mainRoomId, {
                displayName: localParticipant?.name,
                role: 'moderator',
                isSelected: false,
                isNotInMeeting: false,
                //email: localParticipant?.email,
                userId: localParticipant?.userId
            });

            for (const [ , participant ] of remoteParticipants) {
                console.log('🔧 Adding remote participant to preload main room:', {
                    displayName: participant?.name,
                    userId: participant?.userId
                });

                addParticipantToRoom(mainRoomId, {
                    displayName: participant?.name,
                    role: 'participant',
                    isSelected: false,
                    isNotInMeeting: false,
                    //email: participant.email,
                    userId: participant?.userId
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
                // 移除 jid 字段
                const { jid, ...participantWithoutJid } = item;
                addParticipantToRoom(roomId, participantWithoutJid);
            } else if (isParticipantInRoom(roomId, item.jid)) {
                const mainRoom = getPreMainRoom();
                if (mainRoom) {
                    const { jid, ...participantWithoutJid } = item;
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

                // 重新生成 jid（如果不存在）
                if (!participant.jid) {
                    participant.jid = participant.userId || participantId;
                }

                // 检查用户是否真的在会议中
                if (participant.isNotInMeeting === undefined) {
                    participant.isNotInMeeting = checkIfUserIsInMeeting(participant, getState);
                }

                // 设置选择状态
                if (participant.isSelected === undefined) {
                    participant.isSelected = false;
                }

                // 根据 users 结构中的 isGroupLeader 设置 role
                if (participant.role === undefined) {
                    const userInfo = room.users?.[participant.userId];
                    participant.role = (userInfo && userInfo.isGroupLeader) ? 'moderator' : 'participant';
                }
            });

            if (renamedRooms[roomId]) {
                room.name = renamedRooms[roomId];
            }
        });

        setAllRoomsData(meetingData as AllRoomsData);

        Object.entries(remoteParticipants).forEach(([ id, participant ]) => {
            const userId = participant.userId ?? '';

            if (!isUserIdInAnyRoom(userId)) {
                const mainRoomId = getPreMainRoom()?.id;

                if (mainRoomId) {
                    addParticipantToRoom(mainRoomId, {
                        displayName: participant.name ?? 'Unknown',
                        role: 'participant' as const,
                        isSelected: false,
                        isNotInMeeting: false,
                        userId: participant?.userId
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

// 需要实现这个函数来检查用户是否真的在会议中
function checkIfUserIsInMeeting(participant: IParticipant, getState: IStore['getState']): boolean {
    // 使用现有的函数获取当前会议参与者
    const state = getState();
    const localParticipant = getLocalParticipant(state);
    const remoteParticipants = getRemoteParticipants(state);
    
    // 检查本地参与者
    if (localParticipant && (localParticipant.userId === participant.userId)) {
        return true; // 本地参与者在会议中
    }
    
    // 检查远程参与者
    for (const [, remoteParticipant] of remoteParticipants) {
        if (remoteParticipant.userId === participant.userId) {
            return true; // 远程参与者在会议中
        }
    }
    
    return false; // 不在会议中
}