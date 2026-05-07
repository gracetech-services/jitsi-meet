import Popover from '@mui/material/Popover';
import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';

import { withPixelLineHeight } from '../../../base/styles/functions.web';
import { formatCountdown } from '../../functions';
import { IDisplayProps } from '../BreakoutRoomTimer';

const useStyles = makeStyles()(theme => {
    return {
        container: {
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: theme.spacing(1)
        },

        containerClickable: {
            cursor: 'pointer'
        },

        timer: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            color: theme.palette.text01,
            padding: '2px 6px',
            borderRadius: 4
        },

        /**
         * Remaining time <= 60 seconds, text color changes to warning.
         * Use theme.palette.textError.
         */
        timerWarning: {
            color: theme.palette.textError
        },

        popover: {
            padding: theme.spacing(2),
            pointerEvents: 'none'
        },

        roomItem: {
            padding: `${theme.spacing(1)}px 0`,
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: 200
        },

        roomName: {
            marginRight: theme.spacing(2)
        },

        roomTimer: {
            fontFamily: 'monospace'
        }
    };
});

/**
 * Web platform BreakoutRoom countdown display component.
 *
 * - Countdown display on meeting time right side
 * - Show only time (remainingmm:ss)
 * - Show room name + time (room name remainingmm:ss)
 * - On main room hover, Popover displays all rooms countdown
 * - Remaining time <= 60 seconds, text color changes to warning.
 *
 * @param {IDisplayProps} props - Component props.
 * @returns {ReactElement}
 */
export default function BreakoutRoomTimerDisplay({
    timerValue,
    isWarning,
    isInBreakoutRoom,
    earliestRoomName,
    roomsWithExpiry
}: IDisplayProps) {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);

    /**
     * On main room hover, Popover displays all rooms countdown.
     */
    const canShowPopover = !isInBreakoutRoom
        && roomsWithExpiry
        && roomsWithExpiry.length > 1;

    const handleMouseEnter = canShowPopover
        ? (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
        : undefined;

    const handleMouseLeave = canShowPopover
        ? () => setAnchorEl(null)
        : undefined;

    /**
     * SubRoom timer format — (Remaining mm:ss)
     * MainRoom timer format — (Room name remaining mm:ss).
     */
    const displayText = isInBreakoutRoom
        ? t('breakoutRooms.timer.remaining', { time: timerValue })
        : t('breakoutRooms.timer.roomRemaining', { room: earliestRoomName, time: timerValue });

    return (
        <>
            <span
                className = { cx(
                    classes.container,
                    canShowPopover && classes.containerClickable
                ) }
                // eslint-disable-next-line react/jsx-no-bind
                onMouseEnter = { handleMouseEnter }
                // eslint-disable-next-line react/jsx-no-bind
                onMouseLeave = { handleMouseLeave }>
                <span
                    className = { cx(
                        classes.timer,
                        isWarning && classes.timerWarning
                    ) }>
                    { displayText }
                </span>
            </span>
            { canShowPopover && (
                <Popover
                    anchorEl = { anchorEl }
                    anchorOrigin = {{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    disableRestoreFocus = { true }
                    // eslint-disable-next-line react/jsx-no-bind
                    onClose = { () => setAnchorEl(null) }
                    open = { Boolean(anchorEl) }
                    sx = {{ '& .MuiPopover-paper': { pointerEvents: 'none' } }}
                    transformOrigin = {{
                        vertical: 'top',
                        horizontal: 'left'
                    }}>
                    <div className = { classes.popover }>
                        { roomsWithExpiry!.map(room => (
                            <div
                                className = { classes.roomItem }
                                key = { room.name }>
                                <span className = { classes.roomName }>
                                    { room.name }
                                </span>
                                <span className = { classes.roomTimer }>
                                    { formatCountdown(Math.max(0, room.expiresAt - Date.now())) }
                                </span>
                            </div>
                        ))}
                    </div>
                </Popover>
            )}
        </>
    );
}
