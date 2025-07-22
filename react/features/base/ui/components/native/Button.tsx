import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlight, View  } from 'react-native';
import { Button as NativePaperButton, Text } from 'react-native-paper';

import { appType } from '../../../config/AppType';
import { BUTTON_MODES, BUTTON_TYPES } from '../../constants.native';
import BaseTheme from '../BaseTheme.native';
import { IButtonProps } from '../types';

import styles from './buttonStyles';
import fishMeetButtonStyles from './fishMeetButtonStyles';

export interface IProps extends IButtonProps {
    color?: string | undefined;
    contentStyle?: Object | undefined;
    labelStyle?: Object | undefined;
    mode?: any;
    style?: Object | undefined;
}

const Button: React.FC<IProps> = ({
    accessibilityLabel,
    color: buttonColor,
    contentStyle,
    disabled,
    icon,
    labelKey,
    labelStyle,
    mode = BUTTON_MODES.CONTAINED,
    onClick: onPress,
    style,
    type
}: IProps) => {
    const { t } = useTranslation();
    const { DESTRUCTIVE,
        PRIMARY,
        SECONDARY,
        TERTIARY,
        FISHMEET_PRIMARY,
        FISHMEET_SECONDARY,
        FISHMEET_TERTIARY
    } = BUTTON_TYPES;
    const { CONTAINED, TEXT } = BUTTON_MODES;

    let buttonLabelStyles;
    let buttonStyles;
    let color;

    if (type === PRIMARY) {
        buttonLabelStyles = mode === TEXT
            ? styles.buttonLabelPrimaryText
            : styles.buttonLabelPrimary;
        color = mode === CONTAINED && BaseTheme.palette.action01;
    } else if (type === SECONDARY) {
        buttonLabelStyles = styles.buttonLabelSecondary;
        color = mode === CONTAINED && BaseTheme.palette.action02;
    } else if (type === DESTRUCTIVE) {
        buttonLabelStyles = mode === TEXT
            ? styles.buttonLabelDestructiveText
            : styles.buttonLabelDestructive;
        color = mode === CONTAINED && BaseTheme.palette.actionDanger;
    } else if (type === FISHMEET_PRIMARY) {
        buttonLabelStyles = fishMeetButtonStyles.fishMeetButtonLabelPrimaryText;
        color = mode === CONTAINED && BaseTheme.palette.fishMeetMainColor01;
    } else if (type === FISHMEET_SECONDARY) {
        buttonLabelStyles = fishMeetButtonStyles.fishMeetButtonLabelPrimaryText;
        color = mode === CONTAINED && BaseTheme.palette.fishMeetAction01;
    } else if (type === FISHMEET_TERTIARY) {
        buttonLabelStyles = fishMeetButtonStyles.fishMeetButtonLabelPrimaryText;
        color = mode === CONTAINED && BaseTheme.palette.fishMeetMainColor02;
    } else {
        color = buttonColor;
        buttonLabelStyles = styles.buttonLabel;
    }

    if (disabled) {
        buttonLabelStyles = styles.buttonLabelDisabled;
        buttonStyles = appType.isFishMeet ? fishMeetButtonStyles.fishMeetButtonDisabled : styles.buttonDisabled;
    } else {
        buttonStyles = appType.isFishMeet ? fishMeetButtonStyles.fishMeetButton : styles.button;
    }

    if (type === TERTIARY) {
        if (disabled) {
            buttonLabelStyles = styles.buttonLabelTertiaryDisabled;
        }
        buttonLabelStyles = styles.buttonLabelTertiary;

        return (
            <TouchableHighlight
                accessibilityLabel = { accessibilityLabel }
                disabled = { disabled }
                onPress = { onPress }
                style = { [
                    buttonStyles,
                    style
                ] }>
                <Text
                    numberOfLines = { 0 }
                    style = { [
                        buttonLabelStyles,
                        labelStyle
                    ] }>{t(labelKey ?? '')}</Text>
            </TouchableHighlight>
        );
    }

    if (appType.isFishMeet && (
    type === DESTRUCTIVE ||
    type === SECONDARY ||
    type === FISHMEET_PRIMARY ||
    type === FISHMEET_SECONDARY ||
    type === FISHMEET_TERTIARY
)) {
    return (
        <TouchableHighlight
            accessibilityLabel = { accessibilityLabel }
            disabled = { disabled }
            onPress = { onPress }
            style = { [
                buttonStyles,
                style,
                { backgroundColor: color }
            ] }
            underlayColor = { color }>
            <View
                style = {{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: BaseTheme.spacing[7], 
                    paddingHorizontal: 16,
                    paddingVertical: 12
                }}>
                <Text
                    numberOfLines = { 0 }
                    style = { [
                        buttonLabelStyles,
                        labelStyle
                    ] }>
                    {t(labelKey ?? '')}
                </Text>
            </View>
        </TouchableHighlight>
    );
}



    return (
        <NativePaperButton
            accessibilityLabel = { t(accessibilityLabel ?? '') }
            buttonColor = { color }
            children = { t(labelKey ?? '') }
            contentStyle = { [
                styles.buttonContent,
                contentStyle
            ] }
            disabled = { disabled }

            // @ts-ignore
            icon = { icon }
            labelStyle = { [
                buttonLabelStyles,
                labelStyle
            ] }
            mode = { mode }
            onPress = { onPress }
            style = { [
                buttonStyles,
                style
            ] } />
    );
};

export default Button;