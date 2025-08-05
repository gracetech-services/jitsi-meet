
import type { IStore } from '../app/types';

import { _UPDATE_PRESET_BREAKOUT_ROOMS } from './actionTypes';
import type { IBreakoutPayload } from './types';


export function updatePresetBreakoutRoom(data: IBreakoutPayload) {
    return (dispatch: IStore['dispatch'], _getState: IStore['getState']) => {
        dispatch({
            type: _UPDATE_PRESET_BREAKOUT_ROOMS,
            payload: data
        });
    };
}

