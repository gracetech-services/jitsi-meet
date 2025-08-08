import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../base/app/actionTypes';
import { CONFERENCE_JOINED } from '../base/conference/actionTypes';
import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import logger from '../breakout-rooms/logger';
import { IRooms } from '../breakout-rooms/types';

import { cleanListener, enablePresetFeature, executeAutoBreakoutRoom, executeBreakoutRoom, retrievePresetBreakoutRoom } from './actions';
import { getAllParticipants, isEnablePreBreakout } from './functions';


MiddlewareRegistry.register(store => next => action => {
    const { dispatch, getState } = store;
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        const { search, hash } = location;
        const isEnable = isEnablePreBreakout(search);

        dispatch(enablePresetFeature(isEnable));
        if (isEnable) {
            dispatch(retrievePresetBreakoutRoom());
        }
        logger.debug('[GTS-PBR] APP_WILL_MOUNT', { search, hash, isEnable });
        break;

    case APP_WILL_UNMOUNT:
        dispatch(cleanListener());
        logger.debug('[GTS-PBR] APP_WILL_UNMOUNT');
        break;

    case CONFERENCE_JOINED:
        const allParticipants = getAllParticipants(getState);

        logger.debug('[GTS-PBR] CONFERENCE_JOINED', { allParticipants });
        break;
    }

    return result;
});


StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    (conference, { dispatch, getState }, previousConference) => {

        if (conference && !previousConference) {
            conference.on(JitsiConferenceEvents.BREAKOUT_ROOMS_UPDATED, ({ roomCounter, rooms }: {
                roomCounter: number; rooms: IRooms;
            }) => {
                const { availableToSetup, availableToAutoSetup } = getState()['features/breakout-room-presetup'];

                logger.debug('[GTS-StateListenerRegistry] Room list updated', {
                    availableToSetup,
                    availableToAutoSetup,
                    roomCounter,
                    rooms
                });

                if (availableToSetup) {
                    dispatch(executeBreakoutRoom());
                }

                if (availableToAutoSetup) {
                    dispatch(executeAutoBreakoutRoom());
                }
            });
        }
    });
