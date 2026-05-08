import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Dialog from '../../../base/ui/components/web/Dialog';
import Input from '../../../base/ui/components/web/Input';
import { createBreakoutRoom } from '../../actions';

/**
 * Dialog for creating a new breakout room with optional duration.
 *
 * @returns {JSX.Element}
 */
export default function CreateBreakoutRoomDialog() {
    const [ roomName, setRoomName ] = useState<string>('');
    const [ durationMin, setDurationMin ] = useState<string>('');
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onSubmit = useCallback(() => {
        const duration = parseInt(durationMin, 10);
        const durationMs = !isNaN(duration) && duration > 0 ? duration * 60000 : undefined;

        dispatch(createBreakoutRoom(roomName.trim() || undefined, durationMs));
    }, [ roomName, durationMin, dispatch ]);

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
