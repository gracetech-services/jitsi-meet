import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Dialog from '../../../../../base/ui/components/web/Dialog';
import Input from '../../../../../base/ui/components/web/Input';
import { launchAutoSetup } from '../../../../../breakout-room-autosetup/actions';


/**
 * Implements a React {@code Component} for displaying a dialog with a field
 * for setting a breakout room's count.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
const AutoBreakoutRoomCountPrompt = () => {
    const [ roomCount, setRoomCount ] = useState<number | undefined>(1);
    const [ durationMin, setDurationMin ] = useState<string>('');
    const { t } = useTranslation();
    const okDisabled = !roomCount || roomCount < 1;
    const dispatch = useDispatch();

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

        const durationMs = durationMin ? parseInt(durationMin, 10) * 60000 : undefined;

        dispatch(launchAutoSetup({
            assignRoomCount: roomCount,
            durationMs
        }));
    }, [ roomCount, durationMin, dispatch ]);

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
            minValue = { 1 }
            mode = 'numeric'
            name = 'breakoutRoomCount'
            onChange = { onBreakoutRoomCountChange }
            type = 'number'
            value = { roomCount ?? '' } />
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
    </Dialog>);
};

export default AutoBreakoutRoomCountPrompt;
