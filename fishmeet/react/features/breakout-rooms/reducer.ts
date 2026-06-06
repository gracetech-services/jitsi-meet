import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    UPDATE_BREAKOUT_ROOMS,
    _RESET_BREAKOUT_ROOMS,
    _UPDATE_ROOM_COUNTER
} from './actionTypes';
import { FEATURE_KEY, TIMEOUT_SEPARATOR } from './constants';
import { IRooms } from './types';

const DEFAULT_STATE = {
    rooms: {},
    roomCounter: 0
};

export interface IBreakoutRoomsState {
    roomCounter: number;
    rooms: IRooms;
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
        // Parse encoded room names: strip suffix and extract expiresAt
        const parsedRooms: IRooms = {};

        Object.entries(action.rooms as IRooms).forEach(([ key, room ]) => {
            const sepIdx = room.name?.indexOf(TIMEOUT_SEPARATOR) ?? -1;

            parsedRooms[key] = sepIdx === -1 ? room : {
                ...room,
                name: room.name.slice(0, sepIdx),
                expiresAt: (() => {
                    const val = Number(room.name.slice(sepIdx + 1));

                    return (!isNaN(val) && val > 0) ? val : undefined;
                })()
            };
        });

        const { roomCounter, rooms } = { ...action, rooms: parsedRooms };

        return {
            ...state,
            roomCounter,
            rooms
        };
    }
    case _RESET_BREAKOUT_ROOMS: {
        return DEFAULT_STATE;
    }
    }

    return state;
});
