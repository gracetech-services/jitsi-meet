import React, { ReactNode } from 'react';
import { GestureResponderEvent, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import Icon from '../../../base/icons/components/Icon';
import { IconFishmeetBreakroomClose } from '../../../base/icons/svg';
import fishmeetStyles from '../../../breakout-rooms/components/native/fishmeetStyles';

interface IProps {

    onDelete?: (e?: GestureResponderEvent) => void;

    /**
     * Callback to invoke when the {@code CollapsibleList} is long pressed.
     */
    onLongPress?: (e?: GestureResponderEvent) => void;

    onPress?: (e?: GestureResponderEvent) => void;

    /**
     * Collapsible list title.
     */
    title: object;
}

const FishMeetNormalList = ({ onLongPress, onPress, onDelete, title }: IProps) => (
    <View>
        <TouchableOpacity
            onLongPress = { onLongPress }
            onPress = { onPress }
            style = { fishmeetStyles.normalList as ViewStyle }>
            <Text style = { fishmeetStyles.normalListTile as TextStyle }>
                {title as ReactNode}
            </Text>

            <TouchableOpacity
                onPress = { onDelete }
                style = { fishmeetStyles.closeIcon as ViewStyle }>
                <Icon
                    color = { 'transparent' }
                    size = { 12 }
                    src = { IconFishmeetBreakroomClose } />

            </TouchableOpacity>
        </TouchableOpacity>
    </View>
);

export default FishMeetNormalList;
