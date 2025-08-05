import { updatePresetBreakoutRoom } from './actions';
import { IBreakoutPayload, IMessageData } from './types';

export const isEnablePreBreakout = () => {
    return location.search.includes('pre-breakout=1') || location.hash.includes('pre-breakout');
};

export const getBreakoutConfig = () => {
    window.opener.postMessage({ type: 'Request-MeetingBreakoutRoomParams' }, '*');
    let messageListener: ((event: MessageEvent<IMessageData<IBreakoutPayload>>) => void) | undefined = async (
            event: MessageEvent<IMessageData>
    ) => {
        const { type: msgType, payload } = event.data ?? {};

        if (msgType === 'Response-MeetingBreakoutRoomParams') {
            console.log('[GTS-PBR] getBreakoutConfig data', payload);

            updatePresetBreakoutRoom(payload);

            event.source?.postMessage({ type: 'Received-MeetingBreakoutRoomParams' }, { targetOrigin: event.origin });
        }

    };

    window.addEventListener('message', messageListener);

    const clean = () => {
        if (!messageListener) {
            return;
        }
        window.removeEventListener('message', messageListener);
        messageListener = undefined;
    };

    return { clean };
};
