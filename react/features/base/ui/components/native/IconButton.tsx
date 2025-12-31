import React from 'react';
import { TouchableHighlight, ViewStyle } from 'react-native';

import Icon from '../../../icons/components/Icon';
import fishMeetStyles from '../../../react/components/native/fishMeetStyles';
import styles from '../../../react/components/native/styles';
import { IIconButtonProps } from '../../../react/types';
import { BUTTON_TYPES } from '../../constants.native';
import BaseTheme from '../BaseTheme.native';


const IconButton: React.FC<IIconButtonProps> = ({
    accessibilityLabel,
    color: iconColor,
    disabled,
    id,
    onPress,
    size,
    src,
    style,
    tapColor,
    type
}: IIconButtonProps) => {
    const { PRIMARY, SECONDARY, TERTIARY, FISHMEET_PRIMARY, FISHMEET_SECONDARY, FISHMEET_TERTIARY } = BUTTON_TYPES;

    let color;
    let underlayColor;
    let iconButtonContainerStyles;

    if (type === PRIMARY) {
        color = BaseTheme.palette.icon01;
        iconButtonContainerStyles = styles.iconButtonContainerPrimary;
        underlayColor = BaseTheme.palette.action01;
    } else if (type === SECONDARY) {
        color = BaseTheme.palette.icon04;
        iconButtonContainerStyles = styles.iconButtonContainerSecondary;
        underlayColor = BaseTheme.palette.action02;
    } else if (type === TERTIARY) {
        color = iconColor;
        iconButtonContainerStyles = styles.iconButtonContainer;
        underlayColor = BaseTheme.palette.action03;
    } else if (type === FISHMEET_PRIMARY) {
        color = 'transparent';
        iconButtonContainerStyles = fishMeetStyles.iconFishmeetButtonContainerPrimary;
        underlayColor = BaseTheme.palette.fishMeetMainColor01;
    } else if (type === FISHMEET_SECONDARY) {
        color = BaseTheme.palette.fishMeetText01;
        iconButtonContainerStyles = fishMeetStyles.iconFishmeetButtonContainerPrimary;
        underlayColor = BaseTheme.palette.fishMeetMainColor01;
    } else if (type === FISHMEET_TERTIARY) {
        color = 'transparent';
        iconButtonContainerStyles = fishMeetStyles.iconFishmeetButtonContainerTertiary;
        underlayColor = BaseTheme.palette.fishMeetMainColor02;
    } else {
        color = iconColor;
        underlayColor = tapColor;
    }

    if (disabled) {
        if (type === FISHMEET_PRIMARY || type === FISHMEET_SECONDARY || type === FISHMEET_TERTIARY) {
            color = 'transparent';
            iconButtonContainerStyles = fishMeetStyles.fishMeetIconButtonContainerDisabled;
            underlayColor = 'transparent';
        } else {
            color = BaseTheme.palette.icon03;
            iconButtonContainerStyles = styles.iconButtonContainerDisabled;
            underlayColor = 'transparent';
        }
    }

    return (
        <TouchableHighlight
            accessibilityLabel = { accessibilityLabel }
            disabled = { disabled }
            id = { id }
            onPress = { onPress }
            style = { [
                iconButtonContainerStyles,
                style
            ] as ViewStyle[] }
            underlayColor = { underlayColor }>
            <Icon
                color = { color }
                size = { size ?? 20 }
                src = { src } />
        </TouchableHighlight>
    );
};

export default IconButton;
