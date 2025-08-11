import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import type { IRooms } from '../breakout-rooms/types';

import { executeAutoBreakoutRoom } from './actions';

StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    (conference, { dispatch, getState }, previousConference) => {

        if (conference && !previousConference) {
            conference.on(JitsiConferenceEvents.BREAKOUT_ROOMS_UPDATED, (_params: {
                roomCounter: number; rooms: IRooms;
            }) => {
                const { availableToAutoSetup } = getState()['features/breakout-room-autosetup'];

                if (availableToAutoSetup) {
                    dispatch(executeAutoBreakoutRoom());
                }
            });
        }
    });
