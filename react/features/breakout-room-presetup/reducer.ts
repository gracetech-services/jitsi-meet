import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    _ENABlE_PRESET_BREAKOUT_ROOMS,
    _PRESET_BREAKOUT_ROOMS_ADD_LISTENER,
    _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER,
    _UPDATE_PRESET_BREAKOUT_ROOMS
} from './actionTypes';
import { FEATURE_KEY } from './constants';
import type { IBreakoutPayload } from './types';

const DEFAULT_STATE = {
    enablePresetBreakoutRoom: false,
    presetBreakoutRoomData: {
        groupId: -1,
        meetingCode: -1,
        meetingData: {}
    },
    msgListener: []
};

export type IPresetBreakoutRoomsState = {
    enablePresetBreakoutRoom: boolean;
    msgListener: Array<(params?: unknown) => void>;
    presetBreakoutRoomData: IBreakoutPayload;
};

/**
 * Listen for actions for the breakout-rooms feature.
 */
ReducerRegistry.register<IPresetBreakoutRoomsState>(FEATURE_KEY, (state = DEFAULT_STATE, action): IPresetBreakoutRoomsState => {
    const { payload } = action;

    switch (action.type) {
    case _ENABlE_PRESET_BREAKOUT_ROOMS:
        console.log('[GTS] reducer: _ENABlE_PRESET_BREAKOUT_ROOMS', payload);

        return {
            ...state,
            enablePresetBreakoutRoom: payload
        };

    case _UPDATE_PRESET_BREAKOUT_ROOMS:
        console.log('[GTS] reducer: _UPDATE_PRESET_BREAKOUT_ROOMS', payload);

        return {
            ...state,
            presetBreakoutRoomData: payload
        };

    case _PRESET_BREAKOUT_ROOMS_ADD_LISTENER:
        console.log('[GTS] reducer: _PRESET_BREAKOUT_ROOMS_ADD_LISTENER');

        return {
            ...state,
            msgListener: [
                ...state.msgListener,
                payload
            ]
        };

    case _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER:
        console.log('[GTS] reducer: _PRESET_BREAKOUT_ROOMS_CLEAN_LISTENER');
        state.msgListener.forEach(listener => listener());

        return {
            ...state,
            msgListener: []
        };
    }

    return state;
});
