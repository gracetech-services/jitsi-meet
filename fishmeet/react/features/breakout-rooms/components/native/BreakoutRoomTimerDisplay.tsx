import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import BaseTheme from '../../../base/ui/components/BaseTheme.native';
import { formatCountdown } from '../../functions';
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
    },

    expandedList: {
        backgroundColor: BaseTheme.palette.ui01,
        borderRadius: BaseTheme.shape.borderRadius,
        marginTop: BaseTheme.spacing[1],
        paddingHorizontal: BaseTheme.spacing[3],
        paddingVertical: BaseTheme.spacing[2]
    },

    roomItem: {
        color: BaseTheme.palette.text01,
        fontSize: 13,
        paddingVertical: BaseTheme.spacing[1]
    }
});

/**
 * Native platform BreakoutRoom countdown display component.
 *
 * - Consistent between Native and Web
 * - Sub-rooms only display time (Remaining mm:ss)
 * - Main room displays room name + time (Room Name Remaining mm:ss)
 * - Click the main room to expand countdowns of all sub-rooms (replaces Web hover effect)
 * - Enclose content with Chinese full-width parentheses
 * - Text turns to warning color (textError) when remaining time is within 60 seconds.
 *
 * @param {IDisplayProps} props - Component props.
 * @returns {ReactElement}
 */
export default function BreakoutRoomTimerDisplay({
    timerValue,
    isWarning,
    isInBreakoutRoom,
    earliestRoomName,
    roomsWithExpiry,
    textStyle
}: IDisplayProps) {
    const { t } = useTranslation();
    const [ expanded, setExpanded ] = useState(false);
    const [ foregroundKey, setForegroundKey ] = useState(0);

    /**
     * Listen to AppState changes and force components to re-render when the App returns to the foreground.
     * The parent component BreakoutRoomTimer recalculates the countdown every second using Date.now(),
     * and the tick will be automatically corrected in the next second after returning to the foreground. This listening mechanism ensures that the component
     * re-renders immediately when resuming to the foreground.
     *
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

    /**
     * On main room click, expand countdowns of all sub-rooms (replaces Web hover effect).
     */
    const canExpand = !isInBreakoutRoom
        && roomsWithExpiry
        && roomsWithExpiry.length > 1;

    const toggleExpanded = canExpand
        ? () => setExpanded(prev => !prev)
        : undefined;

    const displayText = isInBreakoutRoom
        ? t('breakoutRooms.timer.remainingNative', { time: timerValue })
        : t('breakoutRooms.timer.roomRemainingNative', { room: earliestRoomName, time: timerValue });

    return (
        <View
            key = { foregroundKey }
            style = { styles.container }>
            <TouchableOpacity
                activeOpacity = { canExpand ? 0.7 : 1 }
                // eslint-disable-next-line react/jsx-no-bind
                onPress = { toggleExpanded }
                style = { styles.touchable }>
                <Text
                    numberOfLines = { 1 }
                    style = { [
                        textStyle,
                        styles.timer,
                        isWarning && styles.timerWarning
                    ] }>
                    { displayText }
                </Text>
            </TouchableOpacity>
            { expanded && !isInBreakoutRoom && roomsWithExpiry && (
                <View style = { styles.expandedList }>
                    { roomsWithExpiry.map(room => (
                        <Text
                            key = { room.name }
                            numberOfLines = { 1 }
                            style = { styles.roomItem }>
                            { `${room.name} ${formatCountdown(Math.max(0, room.expiresAt - Date.now()))}` }
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}
