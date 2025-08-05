import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    _UPDATE_PRESET_BREAKOUT_ROOMS
} from './actionTypes';
import { FEATURE_KEY } from './constants';
import type { IBreakoutPayload } from './types';

const DEFAULT_STATE = {
    presetBreakoutRoom: {
        groupId: -1,
        meetingCode: -1,
        meetingData: {}
    }
};

type IPresetBreakoutRoomsState = {
    presetBreakoutRoom: IBreakoutPayload;
};

/**
 * Listen for actions for the breakout-rooms feature.
 */
ReducerRegistry.register<IPresetBreakoutRoomsState>(FEATURE_KEY, (state = DEFAULT_STATE, action): IPresetBreakoutRoomsState => {
    switch (action.type) {
    case _UPDATE_PRESET_BREAKOUT_ROOMS:
        const { payload } = action;

        return {
            ...state,
            presetBreakoutRoom: payload
        };
    }

    return state;
});
