import ReducerRegistry from '../base/redux/ReducerRegistry';

import { _AVAILABLE_AUTO_SET_BREAKOUT_ROOMS, _AVAILABLE_REMOVE_ALL_BREAKOUT_ROOMS } from './actionTypes';
import { FEATURE_KEY } from './constants';

const DEFAULT_STATE = {
    availableToAutoSetup: false,
    availableToRemoveAllRooms: false
};

export type IAutosetupBreakoutRoomsState = {
    availableToAutoSetup: boolean;
    availableToRemoveAllRooms: boolean;
};

/**
 * Listen for actions for the breakout-rooms feature.
 */
ReducerRegistry.register<IAutosetupBreakoutRoomsState>(FEATURE_KEY, (state = DEFAULT_STATE, action): IAutosetupBreakoutRoomsState => {
    const { type, payload } = action;

    switch (type) {
    case _AVAILABLE_AUTO_SET_BREAKOUT_ROOMS:
        return {
            ...state,
            availableToAutoSetup: payload
        };

    case _AVAILABLE_REMOVE_ALL_BREAKOUT_ROOMS:
        return {
            ...state,
            availableToRemoveAllRooms: payload
        };
    }

    return state;
});
