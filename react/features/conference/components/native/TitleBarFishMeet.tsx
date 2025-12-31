import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

import AudioDeviceToggleButton from '../../../mobile/audio-mode/components/AudioDeviceToggleButton';
import PictureInPictureButton from '../../../mobile/picture-in-picture/components/PictureInPictureButton';
import ParticipantsPaneButton from '../../../participants-pane/components/native/ParticipantsPaneButton';
import ToggleCameraButton from '../../../toolbox/components/native/ToggleCameraButton';

import Labels from './Labels';
import fishMeetStyles from './fishMeetStyles';
import styles from './styles';

interface IProps {

    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    _createOnPress: Function;

    /**
     * Whether participants feature is enabled or not.
     */
    _isParticipantsPaneEnabled: boolean;

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string;

    /**
     * Whether displaying the current room name is enabled or not.
     */
    _roomNameEnabled: boolean;

    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean;
}

/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen for FishMeet.
 *
 * @param {IProps} props - The React props passed to this component.
 * @returns {JSX.Element}
 */
const TitleBarFishMeet = (props: IProps) => {
    const { _isParticipantsPaneEnabled, _visible } = props;

    if (!_visible) {
        return null;
    }

    return (
        <View
            style = { styles.titleBarWrapper as ViewStyle }>
            <View style = { styles.pipButtonContainer as ViewStyle }>
                <PictureInPictureButton styles = { styles.pipButton } />
            </View>
            <View
                pointerEvents = 'box-none'
                style = { styles.roomNameWrapper as ViewStyle }>
                {
                    props._roomNameEnabled
                    && <View
                        style = { fishMeetStyles.fishMeetRoomNameView as ViewStyle }>
                        <Text
                            numberOfLines = { 1 }
                            style = { styles.roomName }>
                            {props._meetingName}
                        </Text>
                    </View>
                }
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Labels createOnPress = { props._createOnPress } />
            </View>
            <View style = { styles.titleBarButtonContainer }>
                <ToggleCameraButton
                    styles = { fishMeetStyles.fishMeetTitleBarButton } />
            </View>
            <View style = { styles.titleBarButtonContainer }>
                <AudioDeviceToggleButton
                    styles = { fishMeetStyles.fishMeetTitleBarButton } />
            </View>
            {
                _isParticipantsPaneEnabled
                && <View style = { styles.titleBarButtonContainer }>
                    <ParticipantsPaneButton
                        styles = { fishMeetStyles.fishMeetTitleBarButton } />
                </View>
            }
        </View>
    );
};


export default TitleBarFishMeet;
