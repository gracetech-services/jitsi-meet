import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import InputDialog from '../../../base/dialog/components/native/InputDialog';
import Button from '../../../base/ui/components/native/Button';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';
import { createBreakoutRoom } from '../../actions';

import styles from './styles';

/**
 * Button to add a breakout room.
 *
 * @returns {JSX.Element} - The add breakout room button.
 */
const AddBreakoutRoomButton = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [ showNameDialog, setShowNameDialog ] = useState(false);
    const [ showDurationDialog, setShowDurationDialog ] = useState(false);
    const [ roomName, setRoomName ] = useState<string>();

    const onAdd = useCallback(() => {
        setRoomName(undefined);
        setShowDurationDialog(false);
        setShowNameDialog(true);
    }, []);

    const onNameSubmit = useCallback((name: string) => {
        const trimmed = name.trim();

        if (trimmed) {
            setRoomName(trimmed);
            setShowNameDialog(false);
            setShowDurationDialog(true);

            return true;
        }

        return false;
    }, []);

    const onDurationSubmit = useCallback((duration: string) => {
        const durationMs = duration ? parseInt(duration, 10) * 60000 : undefined;

        dispatch(createBreakoutRoom(roomName || undefined, durationMs));
        setShowDurationDialog(false);

        return true;
    }, [ roomName, dispatch ]);

    return (
        <>
            <Button
                accessibilityLabel = 'breakoutRooms.actions.add'
                labelKey = 'breakoutRooms.actions.add'
                onClick = { onAdd }
                style = { styles.button }
                type = { BUTTON_TYPES.SECONDARY } />
            { showNameDialog && (
                <InputDialog
                    descriptionKey = 'dialog.addBreakoutRoomLabel'
                    onSubmit = { onNameSubmit } />
            )}
            { showDurationDialog && (
                <InputDialog
                    descriptionKey = 'dialog.breakoutRoomDurationLabel'
                    onSubmit = { onDurationSubmit }
                    placeholder = { t('dialog.breakoutRoomDurationPlaceholder') }
                    textInputProps = {{ keyboardType: 'numeric' }} />
            )}
        </>
    );
};

export default AddBreakoutRoomButton;
