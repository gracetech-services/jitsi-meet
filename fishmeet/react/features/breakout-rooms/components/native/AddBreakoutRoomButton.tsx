import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import InputDialog from '../../../base/dialog/components/native/InputDialog';
import Button from '../../../base/ui/components/native/Button';
import Switch from '../../../base/ui/components/native/Switch';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';
import { createBreakoutRoom } from '../../actions';
import { getGlobalExpiresAt } from '../../functions';

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
    const globalExpiresAt = useSelector(getGlobalExpiresAt);
    const [ reuseTimer, setReuseTimer ] = useState(false); // 默认 OFF — 不沿用定时器 (per D-02)
    const reuseTimerRef = useRef(false); // 用 ref 跟踪 reuseTimer，避免闭包捕获过期值 (WR-03)

    reuseTimerRef.current = reuseTimer;
    const hasGlobalTimer = Boolean(globalExpiresAt);

    const onAdd = useCallback(() => {
        setRoomName(undefined);
        setReuseTimer(false); // 重置 Switch 状态
        setShowDurationDialog(false);
        setShowNameDialog(true);
    }, []);

    const onNameSubmit = useCallback((name: string) => {
        const trimmed = name.trim();

        if (trimmed) {
            setRoomName(trimmed);
            setShowNameDialog(false);

            if (hasGlobalTimer) {
                // When there is a global timer: Read the latest value of reuseTimer via ref to avoid closure staleness
                const durationMs = reuseTimerRef.current
                    ? (globalExpiresAt! - Date.now())
                    : undefined;
                const safeDurationMs = durationMs && durationMs > 0 ? durationMs : undefined;

                dispatch(createBreakoutRoom(trimmed || undefined, safeDurationMs));
            } else {
                setShowDurationDialog(true);
            }

            return true;
        }

        return false;
    }, [ hasGlobalTimer, globalExpiresAt, dispatch ]);

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
            { hasGlobalTimer && (
                <View style = { styles.reuseTimerRow as ViewStyle }>
                    <Text style = { styles.reuseTimerLabel }>
                        { t('breakoutRooms.timer.reuseTimer') }
                    </Text>
                    <Switch
                        checked = { reuseTimer }
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange = { (checked?: boolean) => setReuseTimer(checked ?? false) } />
                </View>
            )}
            { showNameDialog && (
                <InputDialog
                    descriptionKey = 'dialog.addBreakoutRoomLabel'
                    onSubmit = { onNameSubmit } />
            )}
            { showDurationDialog && (
                <InputDialog
                    descriptionKey = 'dialog.breakoutRoomDurationLabel'
                    onSubmit = { onDurationSubmit }
                    textInputProps = {{ keyboardType: 'numeric', placeholder: t('dialog.breakoutRoomDurationPlaceholder') }} />
            )}
        </>
    );
};

export default AddBreakoutRoomButton;
