import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { showNotification } from '../../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE, NOTIFICATION_TYPE } from '../../notifications/constants';
import { moveToRoom } from '../actions';
import { AUTO_RETURN_DELAY_MS, WARNING_THRESHOLD_MS } from '../constants';
import { formatCountdown, getBreakoutRooms, getCurrentRoomExpiresAt, isInBreakoutRoom } from '../functions';

import { BreakoutRoomTimerDisplay } from './index';

/**
 * The type of the React {@code Component} props of {@link BreakoutRoomTimer}.
 */
interface IProps {

    /**
     * Style object to pass to platform display component.
     */
    textStyle?: Object;
}

export interface IDisplayProps {

    /**
     * Earliest breakout room name, or undefined in breakout room context.
     */
    earliestRoomName?: string;

    /**
     * Current breakout room status.
     */
    isInBreakoutRoom?: boolean;

    /**
     * Warning status (remaining time <= 60 seconds).
     */
    isWarning?: boolean;

    /**
     * List of non-main rooms with expiry set, to display in expanded form.
     */
    roomsWithExpiry?: Array<{
        expiresAt: number;
        isMainRoom: boolean;
        name: string;
    }>;

    /**
     * Style object to pass to platform display component, for Native use.
     */
    textStyle?: Object;

    /**
     * Current countdown string, e.g. "14:58" or "1:14:58".
     */
    timerValue?: string;
}

const BreakoutRoomTimer = ({ textStyle }: IProps) => {
    const currentExpiresAt = useSelector(getCurrentRoomExpiresAt);
    const rooms = useSelector(getBreakoutRooms);
    const inBreakoutRoom = useSelector(isInBreakoutRoom);
    const dispatch = useDispatch();

    const [ timerValue, setTimerValue ] = useState<string>('');
    const [ isWarning, setIsWarning ] = useState(false);

    const interval = useRef<ReturnType<typeof setInterval>>();

    // Track whether has expired, to prevent duplicate dispatch.
    const hasExpired = useRef(false);

    // Track the setTimeout ID that returns automatically upon expiration, and clear it when the component unmounts
    const autoReturnTimeout = useRef<ReturnType<typeof setTimeout>>();

    // Track latest inBreakoutRoom status, to validate participant presence.
    const inBreakoutRoomRef = useRef(inBreakoutRoom);

    inBreakoutRoomRef.current = inBreakoutRoom;

    /**
     * Core update logic: calculate countdown based on current room status.
     * - Show countdown for current room only in breakout room.
     * - Show countdown for earliest expiring breakout room in main room.
     * - Each tick use Date.now() to recalculate countdown, not accumulate.
     * - Enter warning status when remaining time <= 60 seconds.
     * - Show notification + auto return to main room when countdown reaches zero.
     * - Use global setInterval.
     */
    const updateTimer = useCallback(() => {
        // In breakout room: show countdown for current room
        if (inBreakoutRoom && currentExpiresAt) {
            const remainingMs = Math.max(0, currentExpiresAt - Date.now());

            setTimerValue(formatCountdown(remainingMs));
            setIsWarning(remainingMs > 0 && remainingMs <= WARNING_THRESHOLD_MS);

            // In breakout room: handle expiration — show notification + auto return to main room
            if (remainingMs === 0 && !hasExpired.current) {
                hasExpired.current = true;
                dispatch(showNotification({
                    titleKey: 'breakoutRooms.notifications.timeUpTitle',
                    descriptionKey: 'breakoutRooms.notifications.timeUpDesc',
                    appearance: NOTIFICATION_TYPE.WARNING
                }, NOTIFICATION_TIMEOUT_TYPE.SHORT));

                // fix: Verify in the setTimeout callback that the participant is still in the assigned room,
                // Prevent repeated dispatch of moveToRoom after being relocated by the safety net
                autoReturnTimeout.current = setTimeout(() => {
                    autoReturnTimeout.current = undefined;
                    if (inBreakoutRoomRef.current) {
                        dispatch(moveToRoom());
                    }
                }, AUTO_RETURN_DELAY_MS);
            }

            return;
        }

        // In main room: find earliest expiring breakout room
        if (!inBreakoutRoom) {
            const breakoutRooms = Object.values(rooms)
                .filter(r => !r.isMainRoom && r.expiresAt);

            if (breakoutRooms.length === 0) {
                setTimerValue('');
                setIsWarning(false);

                return;
            }

            // Find earliest expiring breakout room
            // fix: use ?? Infinity to guard expiresAt being undefined
            const earliest = breakoutRooms.reduce((prev, curr) =>
                (prev.expiresAt ?? Infinity) < (curr.expiresAt ?? Infinity) ? prev : curr
            );
            const remainingMs = Math.max(0, (earliest.expiresAt ?? Date.now()) - Date.now());

            setTimerValue(formatCountdown(remainingMs));
            setIsWarning(remainingMs > 0 && remainingMs <= WARNING_THRESHOLD_MS);
        }
    }, [ currentExpiresAt, rooms, inBreakoutRoom, dispatch ]);

    /**
     * Calculate list of non-main rooms with expiry set, to display in expanded form.
     * Fix: use useMemo to avoid re-creating object array every tick.
     */
    const roomsWithExpiry = useMemo(() =>
        Object.values(rooms)
            .filter(r => !r.isMainRoom && r.expiresAt)
            .map(r => ({
                name: r.name || '',
                expiresAt: r.expiresAt ?? 0,
                isMainRoom: r.isMainRoom || false
            })),
    [ rooms ]);

    /**
     * Calculate earliest expiring breakout room name in main room.
     * Fix: calculate based on roomsWithExpiry, to avoid duplicate reduce logic.
     */
    const earliestRoomName = !inBreakoutRoom && roomsWithExpiry.length > 0
        ? roomsWithExpiry.reduce((prev, curr) =>
            prev.expiresAt < curr.expiresAt ? prev : curr
        ).name
        : undefined;

    useEffect(() => {
        // Reset expiration status (when expiresAt changes, e.g. when switching to new breakout room)
        hasExpired.current = false;

        // Immediately execute one update tick
        updateTimer();

        // global setInterval, no window. prefix
        interval.current = setInterval(updateTimer, 1000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
            if (autoReturnTimeout.current) {
                clearTimeout(autoReturnTimeout.current);
            }
        };
    }, [ updateTimer ]);

    // No countdown when no breakout room
    if (!timerValue) {
        return null;
    }

    return (
        <BreakoutRoomTimerDisplay
            earliestRoomName = { earliestRoomName }
            isInBreakoutRoom = { inBreakoutRoom }
            isWarning = { isWarning }
            roomsWithExpiry = { roomsWithExpiry }
            textStyle = { textStyle }
            timerValue = { timerValue } />
    );
};

export default BreakoutRoomTimer;
