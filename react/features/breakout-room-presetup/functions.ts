import { reduce } from 'lodash-es';

import { IStateful } from '../base/app/types';
import { getParticipantById, isLocalParticipantModerator } from '../base/participants/functions';
import { IParticipant } from '../base/participants/types';
import { toState } from '../base/redux/functions';
import { getRoomsInfo } from '../breakout-rooms/functions';
import { IRoomInfo } from '../breakout-rooms/types';

import { FEATURE_KEY } from './constants';
import { IBreakoutPayload } from './types';

export const isEnablePreBreakout = (search = location.search) => {
    return search.includes('pre-breakout=1') || search.includes('pre-breakout');
};

export const isPresetBreakoutRoomButtonVisible = (stateful: IStateful) => {
    const state = toState(stateful);
    const isLocalModerator = isLocalParticipantModerator(state);
    const { conference } = state['features/base/conference'];
    const isBreakoutRoomsSupported = conference?.getBreakoutRooms()?.isSupported();

    const { enablePresetBreakoutRoom } = state['features/breakout-room-presetup'] ?? {};

    0 && console.log('[GTS-PBR] isPresetBreakoutRoomButtonVisible', {
        isLocalModerator,
        isBreakoutRoomsSupported,
        enablePresetBreakoutRoom
    });

    return isLocalModerator && isBreakoutRoomsSupported && enablePresetBreakoutRoom;
};


export const getPresetupBreakoutRoomsConfig = (stateful: IStateful) => {
    const state = toState(stateful);
    const { presetupBreakoutRooms = {} } = state['features/base/config'];

    return presetupBreakoutRooms;
};

export const getPresetBreakoutRoomData = (stateful: IStateful): IBreakoutPayload => toState(stateful)[FEATURE_KEY]?.presetRoomData;

export const getAllParticipants = (stateful: IStateful) => {
    const { rooms } = getRoomsInfo(stateful);

    return reduce<IRoomInfo, IParticipant[]>(rooms, (result, room) => {
        room.participants.forEach(participant => {
            const item = getParticipantById(stateful, participant.id);

            if (item) {
                result.push(item);
            }
        });

        return result;
    }, []);
};
