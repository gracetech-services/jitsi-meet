import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    IS_SHOW_LOADING,
    SET_START_OPEN_ALL_ROOMS,
    UPDATE_BREAKOUT_ROOMS,
    UPLOAD_RESULT,
    _RESET_BREAKOUT_ROOMS,
    _UPDATE_ROOM_COUNTER
} from './actionTypes';
import { FEATURE_KEY } from './constants';
import { IRooms } from './types';

const DEFAULT_STATE = {
    rooms: {},
    roomCounter: 0,
    startOpenAllRooms: false,
    isShowLoading: false,
    uploadResult: undefined
};

export interface IBreakoutRoomsState {
    isShowLoading: boolean;
    roomCounter: number;
    rooms: IRooms;
    startOpenAllRooms: boolean;
    uploadResult: boolean | undefined;
}

/**
 * Listen for actions for the breakout-rooms feature.
 */
ReducerRegistry.register<IBreakoutRoomsState>(FEATURE_KEY, (state = DEFAULT_STATE, action): IBreakoutRoomsState => {
    switch (action.type) {
    case _UPDATE_ROOM_COUNTER:
        return {
            ...state,
            roomCounter: action.roomCounter
        };
    case UPDATE_BREAKOUT_ROOMS: {
        const { roomCounter, rooms } = action;

        return {
            ...state,
            roomCounter,
            rooms
        };
    }
    case _RESET_BREAKOUT_ROOMS: {
        // return DEFAULT_STATE;
        return {
            ...state,
            roomCounter: DEFAULT_STATE.roomCounter,
            rooms: DEFAULT_STATE.rooms
        };
    }
    case SET_START_OPEN_ALL_ROOMS: {
        return {
            ...state,
            startOpenAllRooms: action.startOpenAllRooms
        };
    }
    case IS_SHOW_LOADING: {
        return {
            ...state,
            isShowLoading: action.isShowLoading
        };
    }
    case UPLOAD_RESULT: {
        return {
            ...state,
            uploadResult: action.uploadResult
        };
    }
    }

    return state;
});

