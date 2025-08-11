import { IStateful } from '../base/app/types';
import { isLocalParticipantModerator } from '../base/participants/functions';
import { toState } from '../base/redux/functions';
import { getBreakoutRoomsConfig } from '../breakout-rooms/functions';

export const isAutoBreakoutRoomButtonVisible = (stateful: IStateful) => {
    const state = toState(stateful);
    const isLocalModerator = isLocalParticipantModerator(state);
    const { conference } = state['features/base/conference'];
    const isBreakoutRoomsSupported = conference?.getBreakoutRooms()?.isSupported();
    const { hideAutoAssignButton } = getBreakoutRoomsConfig(state);

    0 && console.log('[GTS-PBR] isAutoBreakoutRoomButtonVisible', {
        isLocalModerator,
        isBreakoutRoomsSupported,
    });

    return isLocalModerator && isBreakoutRoomsSupported && !hideAutoAssignButton;
};
