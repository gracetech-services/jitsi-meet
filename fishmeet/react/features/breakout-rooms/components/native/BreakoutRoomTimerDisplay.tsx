import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import BaseTheme from '../../../base/ui/components/BaseTheme.native';
import { IDisplayProps } from '../BreakoutRoomTimer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },

    touchable: {
        flexDirection: 'row'
    },

    timer: {
        color: BaseTheme.palette.text01,
        fontSize: 13
    },

    /**
     * The countdown text turns red within the remaining 60 seconds.
     * Use BaseTheme.palette.textError.
     */
    timerWarning: {
        color: BaseTheme.palette.textError
    }
});

/**
 * Native platform BreakoutRoom countdown display component.
 *
 * - Unified countdown display for the main room and sub-rooms (Remaining mm:ss)
 * - No room name or click to expand list
 * - Text turns to warning color (textError) when remaining time is within 60 seconds.
 *
 * @param {IDisplayProps} props - Component props.
 * @returns {ReactElement}
 */
export default function BreakoutRoomTimerDisplay({
    timerValue,
    isWarning,
    textStyle
}: IDisplayProps) {
    const { t } = useTranslation();

    const displayText = t('breakoutRooms.timer.remainingNative', { time: timerValue });

    return (
        <View style = { styles.container }>
            <View style = { styles.touchable }>
                <Text
                    numberOfLines = { 1 }
                    style = { [
                        textStyle,
                        styles.timer,
                        isWarning && styles.timerWarning
                    ] }>
                    { displayText }
                </Text>
            </View>
        </View>
    );
}
