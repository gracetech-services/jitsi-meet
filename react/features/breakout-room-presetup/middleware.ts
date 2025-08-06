import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../base/app/actionTypes';
import { CONFERENCE_JOINED } from '../base/conference/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import { cleanListener, enablePresetFeature, retrievePresetBreakoutRoom } from './actions';
import { isEnablePreBreakout } from './functions';


MiddlewareRegistry.register(store => next => action => {
    const { dispatch } = store;
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        const { search, hash } = location;
        const isEnable = isEnablePreBreakout(search);

        dispatch(enablePresetFeature(isEnable));
        if (isEnable) {
            dispatch(retrievePresetBreakoutRoom())
        }
        console.log('[GTS-PBR] APP_WILL_MOUNT', { search, hash, isEnable });
        break;

    case APP_WILL_UNMOUNT:
        dispatch(cleanListener());
        console.log('[GTS-PBR] APP_WILL_UNMOUNT');
        break;

    case CONFERENCE_JOINED:
        console.log('[GTS-PBR] CONFERENCE_JOINED');
        break;
    }

    return result;
});

