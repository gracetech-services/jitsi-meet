import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import Dialog from '../../../base/ui/components/web/Dialog';
import Input from '../../../base/ui/components/web/Input';
import Switch from '../../../base/ui/components/web/Switch';
import { createBreakoutRoom } from '../../actions';
import { getGlobalExpiresAt } from '../../functions';

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
 * Dialog for creating a new breakout room with optional duration.
 *
 * @returns {JSX.Element}
 */
export default function CreateBreakoutRoomDialog() {
    const { classes, cx } = useStyles();
    const [ roomName, setRoomName ] = useState<string>('');
    const [ durationMin, setDurationMin ] = useState<string>('');
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const globalExpiresAt = useSelector(getGlobalExpiresAt);
    const [ reuseTimer, setReuseTimer ] = useState(false);
    const hasGlobalTimer = Boolean(globalExpiresAt);

    const onSubmit = useCallback(() => {
        let durationMs: number | undefined;

        if (hasGlobalTimer) {
            // Switch ON → reuse existing global expiresAt
            // Switch OFF → Create room without timer
            const raw = reuseTimer
                ? (globalExpiresAt! - Date.now())
                : undefined;

            // Ensure positive value (edge case: timer has expired)
            durationMs = raw && raw > 0 ? raw : undefined;
        } else {
            // No global timer: keep existing behavior
            const duration = parseInt(durationMin, 10);

            durationMs = !isNaN(duration) && duration > 0 ? duration * 60000 : undefined;
        }

        dispatch(createBreakoutRoom(roomName.trim() || undefined, durationMs));
    }, [ roomName, durationMin, dispatch, hasGlobalTimer, reuseTimer, globalExpiresAt ]);

    return (
        <Dialog
            ok = {{ translationKey: 'dialog.Ok' }}
            onSubmit = { onSubmit }
            titleKey = 'dialog.addBreakoutRoomTitle'>
            <Input
                autoFocus = { true }
                className = 'dialog-bottom-margin'
                id = 'breakout-rooms-name-input'
                label = { t('dialog.addBreakoutRoomLabel') }
                name = 'breakoutRoomName'
                onChange = { setRoomName }
                type = 'text'
                value = { roomName } />
            { hasGlobalTimer ? (
                <div className = { cx('control-row', classes.formItemContainer) }>
                    <label htmlFor = 'reuse-timer-switch'>
                        { t('breakoutRooms.timer.reuseTimer') }
                    </label>
                    <Switch
                        checked = { reuseTimer }
                        id = 'reuse-timer-switch'
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange = { (checked?: boolean) => setReuseTimer(checked ?? false) } />
                </div>
            ) : (
                <Input
                    className = 'dialog-bottom-margin'
                    id = 'breakout-rooms-duration-input'
                    label = { t('dialog.breakoutRoomDurationLabel') }
                    minValue = { 0 }
                    name = 'breakoutRoomDuration'
                    onChange = { setDurationMin }
                    placeholder = { t('dialog.breakoutRoomDurationPlaceholder') }
                    type = 'number'
                    value = { durationMin } />
            ) }
        </Dialog>
    );
}
