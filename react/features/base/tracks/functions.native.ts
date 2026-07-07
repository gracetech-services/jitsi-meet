import { IStore } from '../../app/types';
import { requestMediaPermissions } from '../../mobile/permissions/functions';
import JitsiMeetJS from '../lib-jitsi-meet';

import { getCameraFacingMode } from './functions.any';
import { ITrackOptions } from './types';

export * from './functions.any';

/**
 * Create local tracks of specific types.
 *
 * @param {Object} options - The options with which the local tracks are to be
 * created.
 * @param {string|null} [options.cameraDeviceId] - Camera device id or
 * {@code undefined} to use app's settings.
 * @param {string[]} options.devices - Required track types such as 'audio'
 * and/or 'video'.
 * @param {string|null} [options.micDeviceId] - Microphone device id or
 * {@code undefined} to use app's settings.
 * @param {number|undefined} [options.timeout] - A timeout for JitsiMeetJS.createLocalTracks used to create the tracks.
 * @param {IStore} store - The redux store in the context of which the function
 * is to execute and from which state such as {@code config} is to be retrieved.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
export function createLocalTracksF(options: ITrackOptions = {}, store: IStore) {
    const { cameraDeviceId, micDeviceId } = options;
    const state = store.getState();
    const {
        resolution
    } = state['features/base/config'];
    const constraints = options.constraints ?? state['features/base/config'].constraints;

    // Copy array to avoid mutations inside library.
    const devices = options.devices?.slice(0);

    // Ensure the Android runtime permissions are requested (and the system
    // dialog shown) before getUserMedia runs, so the flow does not depend on
    // react-native-webrtc's internal serialized permission queue.
    return requestMediaPermissions(devices).then(() =>
        JitsiMeetJS.createLocalTracks(
            {
                cameraDeviceId,
                constraints,
                devices,
                facingMode: options.facingMode || getCameraFacingMode(state),
                micDeviceId,
                resolution
            }));
}
