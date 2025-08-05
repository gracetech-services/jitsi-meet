import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../base/app/actionTypes';
import { CONFERENCE_JOINED } from '../base/conference/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import { getBreakoutConfig, isEnablePreBreakout } from './functions';


MiddlewareRegistry.register(_store => next => action => {
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        const { search, hash } = location;


        if (isEnablePreBreakout()) {
            getBreakoutConfig();
        }
        console.log('[GTS-PBR] APP_WILL_MOUNT', { search, hash });
        break;
    case APP_WILL_UNMOUNT:
        console.log('[GTS-PBR] APP_WILL_UNMOUNT');
        break;
    case CONFERENCE_JOINED:
        console.log('[GTS-PBR] CONFERENCE_JOINED');
        break;

    }

    return result;
});

