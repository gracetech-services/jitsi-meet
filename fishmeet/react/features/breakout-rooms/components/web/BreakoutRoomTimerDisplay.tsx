import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';

import { withPixelLineHeight } from '../../../base/styles/functions.web';
import { IDisplayProps } from '../BreakoutRoomTimer';

const useStyles = makeStyles()(theme => {
    return {
        container: {
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: theme.spacing(1)
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
        }
    };
});

/**
 * Web platform BreakoutRoom countdown display component.
 *
 * - The countdown is displayed uniformly in both the main room and sub rooms (Remaining mm:ss)
 * - No room name or hover list is displayed
 * - Remaining time <= 60 seconds, text color changes to warning.
 *
 * @param {IDisplayProps} props - Component props.
 * @returns {ReactElement}
 */
export default function BreakoutRoomTimerDisplay({
    timerValue,
    isWarning
}: IDisplayProps) {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const displayText = t('breakoutRooms.timer.remaining', { time: timerValue });

    return (
        <span className = { classes.container }>
            <span className = { cx(classes.timer, isWarning && classes.timerWarning) }>
                { displayText }
            </span>
        </span>
    );
}
