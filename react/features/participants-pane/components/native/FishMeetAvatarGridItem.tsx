import React from 'react';
import {
    GestureResponderEvent,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { Text } from 'react-native-paper';

import Avatar from '../../../base/avatar/components/Avatar';

import fishMeetStyles from './fishMeetStyles';

interface IProps {

    /**
     * The name of the participant. Used for showing lobby names.
     */
    displayName: string;

    /**
     * State isNotInMeeting.
     */
    isNotInMeeting: boolean;

    /**
     * Callback to be invoked on pressing the participant item.
     */
    onPress?: (e?: GestureResponderEvent) => void;

    /**
     * The ID of the participant.
     */
    participantID: string;
}

/**
 * Participant item.
 *
 * @returns {React$Element<any>}
 */
function FishMeetAvatarGridItem({
    displayName,
    participantID,
    isNotInMeeting,
    onPress
}: IProps) {
    return (
        <TouchableOpacity
            onPress = { onPress }
            style = { fishMeetStyles.avatarItemContainer as ViewStyle }>
            <Avatar
                displayName = { displayName }
                participantId = { participantID }
                size = { 50 } />
            <Text
                numberOfLines = { 1 }
                style = { (isNotInMeeting
                    ? fishMeetStyles.disableAvatarName
                    : fishMeetStyles.avatarName) as ViewStyle }>
                {displayName}
            </Text>
        </TouchableOpacity>
    );
}


export default FishMeetAvatarGridItem;
