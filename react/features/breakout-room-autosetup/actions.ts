import { IStore } from '../app/types';
import { autoAssignToBreakoutRooms, closeBreakoutRoom, createBreakoutRoom, removeBreakoutRoom } from '../breakout-rooms/actions';
import { getBreakoutRooms } from '../breakout-rooms/functions';

import { _AVAILABLE_AUTO_SET_BREAKOUT_ROOMS } from './actionTypes';

export function availableAutoToSetup(value: boolean) {
    return {
        type: _AVAILABLE_AUTO_SET_BREAKOUT_ROOMS,
        payload: value
    };
}
export function executeAutoBreakoutRoom() {
    return async (dispatch: IStore['dispatch'], _getState: IStore['getState']) => {
        dispatch(availableAutoToSetup(false));

        // even if waiting for the middleware callback, it still takes some time to create rooms
        await new Promise(resolve => setTimeout(resolve));
        dispatch(autoAssignToBreakoutRooms());
    };
}

export function removeAllRoomAndAdd(firstTime: boolean, nAdd: number) {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const rooms = getBreakoutRooms(getState);
        const roomArr = Object.entries(rooms).filter(room => !room[1].isMainRoom);
        const nRoom = roomArr.length;

        const rooms2Close = roomArr.filter(room => Object.keys(room[1].participants).length > 0);
        const n2Close = rooms2Close.length;

        if (n2Close === 0) {
            roomArr.forEach(room => dispatch(removeBreakoutRoom(room[1].jid)));
            if (nAdd > 0) {
                if (nRoom === 0) {
                    while (nAdd > 0) {
                        dispatch(createBreakoutRoom());
                        --nAdd;
                    }
                } else {
                    setTimeout(() => dispatch(removeAllRoomAndAdd(false, nAdd)), 100);
                }
            }
        } else {
            if (firstTime) {
                rooms2Close.forEach(room => dispatch(closeBreakoutRoom(room[1].id)));
            }
            setTimeout(() => dispatch(removeAllRoomAndAdd(false, nAdd)), 100);
        }
    };
}
