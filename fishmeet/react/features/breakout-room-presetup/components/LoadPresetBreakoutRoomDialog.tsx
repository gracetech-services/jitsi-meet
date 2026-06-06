import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Dialog from '../../base/ui/components/web/Dialog';
import Input from '../../base/ui/components/web/Input';
import { triggerBreakoutRoom } from '../actions';

/**
 * Dialog for creating a new breakout room with optional duration.
 *
 * @returns {JSX.Element}
 */
export default function LoadPresetBreakoutRoomDialog() {
    const [ durationMin, setDurationMin ] = useState<string>('');
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onSubmit = useCallback(() => {
        const durationMs = durationMin ? parseInt(durationMin, 10) * 60000 : undefined;

        dispatch(triggerBreakoutRoom({ durationMs }));
    }, [ durationMin, dispatch ]);

    return (
        <Dialog
            ok = {{ translationKey: 'dialog.Ok' }}
            onSubmit = { onSubmit }
            titleKey = 'dialog.addBreakoutRoomTitle'>
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
        </Dialog>
    );
}
