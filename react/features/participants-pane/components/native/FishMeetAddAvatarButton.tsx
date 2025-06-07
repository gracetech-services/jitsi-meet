import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';


import fishMeetStyles from './fishMeetStyles';

interface IProps {
    label?: string;
    onPress?: () => void;
}

const FishMeetAddAvatarButton = ({ onPress, label = '增减用户' }: IProps) => (
    <TouchableOpacity
        onPress = { onPress }
        style = { fishMeetStyles.addAvatarContainer as ViewStyle }>
        <View style = { fishMeetStyles.addAvatarCircle as ViewStyle }>
            <Text style = { fishMeetStyles.addAvatarPlus as ViewStyle }>+</Text>
        </View>
        <Text
            numberOfLines = { 2 }
            style = { (fishMeetStyles.avatarName) as ViewStyle }>
            {label}
        </Text>
    </TouchableOpacity>
);


export default FishMeetAddAvatarButton;
