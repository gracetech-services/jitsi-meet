import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import fishmeetStyles from '../../../participants-pane/components/native/fishMeetStyles';

interface IProps {
    onClose: () => void;
    text: string;
}

const FishMeetToastView = ({ text, onClose }: IProps) => (
    <View style = { fishmeetStyles.modalContainer as ViewStyle }>
        <View style = { fishmeetStyles.toastContainerModalContent as ViewStyle }>
            <Text style = { fishmeetStyles.toastText as ViewStyle }>{text}</Text>
            <TouchableOpacity
                onPress = { onClose }
                style = { fishmeetStyles.toastButton }>
                <Text style = { fishmeetStyles.toastButtonText as ViewStyle }>OK</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default FishMeetToastView;
