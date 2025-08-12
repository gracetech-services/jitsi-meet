import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import logger from '../breakout-rooms/logger';
import type { IRooms } from '../breakout-rooms/types';

import { executeAutoBreakoutRoom, executeRemoveAllRooms } from './actions';

StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    (conference, { dispatch, getState }, previousConference) => {

        if (conference && !previousConference) {
            conference.on(JitsiConferenceEvents.BREAKOUT_ROOMS_UPDATED, (_params: {
                rooms: IRooms;
            }) => {
                const { availableToAutoSetup, availableToRemoveAllRooms } = getState()['features/breakout-room-autosetup'];

                logger.debug('[GTS] StateListenerRegistry-autosetup Room Updated:', {
                    availableToAutoSetup,
                    availableToRemoveAllRooms,
                });

                if (availableToAutoSetup) {
                    dispatch(executeAutoBreakoutRoom());
                }

                if (availableToRemoveAllRooms) {
                    dispatch(executeRemoveAllRooms());
                }
            });
        }
    });
