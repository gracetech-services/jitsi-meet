import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, StyleSheet, Text, View } from 'react-native';

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
    const [ foregroundKey, setForegroundKey ] = useState(0);

    /**
     * Listen to AppState changes and force components to re-render when the App returns to the foreground.
     * The parent component BreakoutRoomTimer recalculates the countdown every second using Date.now(),
     * and the tick will be automatically corrected in the next second after returning to the foreground.
     * This listening mechanism ensures that the component re-renders immediately when resuming to the foreground.
     */
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                // Return to the foreground and increment the counter to trigger a real re-render
                setForegroundKey(prev => prev + 1);
            }
        });

        return () => subscription.remove();
    }, []);

    // 统一显示格式，不区分主房间/分房间 (per D-11)
    const displayText = t('breakoutRooms.timer.remainingNative', { time: timerValue });

    return (
        <View
            key = { foregroundKey }
            style = { styles.container }>
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
