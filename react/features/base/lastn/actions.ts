import { IStore } from '../../app/types';
import { toggleVideoStream } from '../video-stream/actions';

import { SET_LAST_N } from './actionTypes';

/**
 * Sets the last-n, i.e., the number of remote videos to be requested from the bridge for the conference.
 *
 * @param {number} lastN - The number of remote videos to be requested.
 * @returns {{
 *     type: SET_LAST_N,
 *     lastN: number
 * }}
 */
export function setLastN(lastN: number) {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        await dispatch({
            type: SET_LAST_N,
            lastN
        });

        const { enable: curEnable } = getState()['features/base/video-stream'];
        const nextEnable = lastN !== 0;

        if (nextEnable !== curEnable) {
            await dispatch(toggleVideoStream(nextEnable));
        }
    };
}
