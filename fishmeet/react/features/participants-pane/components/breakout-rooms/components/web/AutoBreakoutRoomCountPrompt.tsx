import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import Dialog from '../../../../../base/ui/components/web/Dialog';
import Input from '../../../../../base/ui/components/web/Input';
import Switch from '../../../../../base/ui/components/web/Switch';
import { launchAutoSetup } from '../../../../../breakout-room-autosetup/actions';
import { getGlobalExpiresAt } from '../../../../../breakout-rooms/functions';

const useStyles = makeStyles()(() => {
    return {
        formItemContainer: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0',
            gap: '16px'
        }
    };
});

/**
 * Implements a React {@code Component} for displaying a dialog with a field
 * for setting a breakout room's count.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
const AutoBreakoutRoomCountPrompt = () => {
    const { classes, cx } = useStyles();
    const [ roomCount, setRoomCount ] = useState<number | undefined>(1);
    const [ durationMin, setDurationMin ] = useState<string>('');
    const [ reuseTimer, setReuseTimer ] = useState(false);
    const globalExpiresAt = useSelector(getGlobalExpiresAt);

    const { t } = useTranslation();
    const okDisabled = !roomCount || roomCount < 1;
    const dispatch = useDispatch();
    const hasGlobalTimer = Boolean(globalExpiresAt);

    const onBreakoutRoomCountChange = useCallback((newRoomCount: string) => {
        if (newRoomCount === '') {
            setRoomCount(undefined);

            return;
        }

        const count = Number(newRoomCount);

        if (!isNaN(count)) {
            setRoomCount(count);
        }
    }, []);

    const onSubmit = useCallback(() => {
        if (!roomCount) {
            return;
        }

        let durationMs: number | undefined;

        if (hasGlobalTimer) {
            const raw = reuseTimer
                ? (globalExpiresAt! - Date.now())
                : undefined;

            durationMs = raw && raw > 0 ? raw : undefined;
        } else {
            const duration = parseInt(durationMin, 10);

            durationMs = !isNaN(duration) && duration > 0 ? duration * 60000 : undefined;
        }

        dispatch(launchAutoSetup({
            assignRoomCount: roomCount,
            durationMs
        }));
    }, [ roomCount, durationMin, dispatch, hasGlobalTimer, reuseTimer ]);

    return (<Dialog
        ok = {{
            disabled: okDisabled,
            translationKey: 'dialog.Ok'
        }}
        onSubmit = { onSubmit }
        titleKey = 'dialog.autoBreakoutRoomCountTitle'>
        <Input
            autoFocus = { true }
            className = 'dialog-bottom-margin'
            id = 'breakout-rooms-count-input'
            label = { t('dialog.autoBreakoutRoomCountLabel') }
            maxValue = { 10 }
            minValue = { 1 }
            mode = 'numeric'
            name = 'breakoutRoomCount'
            onChange = { onBreakoutRoomCountChange }
            type = 'number'
            value = { roomCount ?? '' } />
        {
            hasGlobalTimer ? <div className = { cx('control-row', classes.formItemContainer) }>
                <label htmlFor = 'reuse-timer-switch'>
                    { t('breakoutRooms.timer.reuseTimer') }
                </label>
                <Switch
                    checked = { reuseTimer }
                    id = 'reuse-timer-switch'
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange = { (checked?: boolean) => setReuseTimer(checked ?? false) } />
            </div>
                : <Input
                    className = 'dialog-bottom-margin'
                    id = 'breakout-rooms-duration-input'
                    label = { t('dialog.breakoutRoomDurationLabel') }
                    minValue = { 0 }
                    name = 'breakoutRoomDuration'
                    onChange = { setDurationMin }
                    placeholder = { t('dialog.breakoutRoomDurationPlaceholder') }
                    type = 'number'
                    value = { durationMin } />
        }
    </Dialog>);
};

export default AutoBreakoutRoomCountPrompt;
