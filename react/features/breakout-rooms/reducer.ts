import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    IS_SHOW_LOADING,
    SET_ALL_ROOMS_OPEN,
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
    areAllRoomsOpen: false,
    isShowLoading: false,
    uploadResult: undefined,
    preBreakoutRooms: null
};

export interface IBreakoutRoomsState {
    areAllRoomsOpen: boolean;
    isShowLoading: boolean;
    preBreakoutRooms: any;
    roomCounter: number;
    rooms: IRooms;
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
    case SET_ALL_ROOMS_OPEN: {
        return {
            ...state,
            areAllRoomsOpen: action.areAllRoomsOpen
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

    case 'RENAME_PRELOAD_ROOM': {
        const { roomId, name } = action;

        return {
            ...state,
            rooms: {
                ...state.rooms,
                [roomId]: {
                    ...state.rooms[roomId],
                    name
                }
            }
        };
    }


    case 'SET_LOAD_PRE_BREAKOUT_ROOMS': {
        return {
            ...state,
            preBreakoutRooms: action.meetingData,
            rooms: action.meetingData,
            roomCounter: Object.keys(action.meetingData).length
        };
    }

    case 'SET_HAS_PRE_BREAKOUT_ROOMS': {
        return {
            ...state,
            hasPreBreakoutRooms: action.hasPre
        };
    }

    }

    return state;
});

