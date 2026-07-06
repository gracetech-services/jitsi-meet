// eslint-disable-next-line react-native/split-platform-components
import { Alert, Linking, NativeModules, Permission, PermissionsAndroid } from 'react-native';

import { getLogger } from '../../base/logging/functions';
import Platform from '../../base/react/Platform.native';

const logger = getLogger('app:permissions');

const PERMISSION_REQUEST_TIMEOUT_MS = 10000;

/**
 * Opens the settings panel for the current platform.
 *
 * @private
 * @returns {void}
 */
export function openSettings() {
    switch (Platform.OS) {
    case 'android':
        NativeModules.AndroidSettings.open().catch(() => {
            Alert.alert(
                'Error opening settings',
                'Please open settings and grant the required permissions',
                [
                    { text: 'OK' }
                ]
            );
        });
        break;

    case 'ios':
        Linking.openURL('app-settings:');
        break;
    }
}

/**
 * Pre-requests the Android runtime permissions (CAMERA and/or RECORD_AUDIO)
 * required to create local tracks, before {@code getUserMedia} runs. This
 * makes the system permission dialog appear deterministically and avoids
 * relying on react-native-webrtc's internal serialized permission queue,
 * which can hang and block all subsequent {@code getUserMedia} calls. A
 * timeout prevents a hung request from blocking track creation; the final
 * granted/denied outcome is still determined by {@code getUserMedia}'s
 * existing error path. On iOS this is a no-op.
 *
 * @param {string[]} devices - The track types about to be created, such as
 * 'audio' or 'video'; 'desktop' and 'screenshare' are ignored.
 * @returns {Promise<void>}
 */
export function requestMediaPermissions(devices: string[] = []): Promise<void> {
    if (Platform.OS !== 'android') {
        return Promise.resolve();
    }

    const perms: Permission[] = [];

    if (devices.includes('audio')) {
        perms.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }

    if (devices.includes('video')) {
        perms.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    if (perms.length === 0) {
        return Promise.resolve();
    }

    const request = PermissionsAndroid.requestMultiple(perms);
    const timeout = new Promise<void>(resolve =>
        setTimeout(resolve, PERMISSION_REQUEST_TIMEOUT_MS));

    return Promise.race([ request, timeout ])
        .then(() => undefined)
        .catch(error => {
            logger.error('Failed to request media permissions', error);
        });
}
