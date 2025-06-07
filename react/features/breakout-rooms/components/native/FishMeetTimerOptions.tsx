import { t } from 'i18next';
import React, { useCallback, useState } from 'react';
import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import Icon from '../../../base/icons/components/Icon';
import {
    IconFishmeetBreakroomTimerSelected,
    IconFishmeetBreakroomTimerUnSelected
} from '../../../base/icons/svg';
import fishmeetStyles from '../../../participants-pane/components/native/fishMeetStyles';

interface IProps {
    timerOptionsClose: (data: { option: string; time?: string; }) => void;
}

const FishMeetTimerOptions = ({ timerOptionsClose }: IProps) => {
    const [ selectedOption, setSelectedOption ] = useState<'auto' | 'manual'>('manual');
    const [ inputValue, setInputValue ] = useState('5');

    const handleConfirm = useCallback(() => {
        Keyboard.dismiss();
        const data = selectedOption === 'manual' ? { option: 'manual' } : {
            option: 'auto',
            time: inputValue
        };

        timerOptionsClose(data);
    }, []);

    const dismissKeyboard = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    const handleAutoSelect = useCallback(() => {
        Keyboard.dismiss();
        setSelectedOption('auto');
    }, [ setSelectedOption ]);

    const handleManualSelect = useCallback(() => {
        Keyboard.dismiss();
        setSelectedOption('manual');
    }, [ setSelectedOption ]);

    return (
        <TouchableWithoutFeedback onPress = { dismissKeyboard }>
            <View style = { fishmeetStyles.modalContainer as ViewStyle }>
                <View style = { fishmeetStyles.timerContainerModalContent as ViewStyle }>
                    <Text style = { fishmeetStyles.timerOptionsText as ViewStyle }>{t('Options')}</Text>

                    <TouchableOpacity
                        onPress = { handleAutoSelect }
                        style = { fishmeetStyles.timerAutoOptionContainer as ViewStyle }>
                        <Icon
                            color = 'transparent'
                            size = { 18 }
                            src = { selectedOption === 'auto'
                                ? IconFishmeetBreakroomTimerSelected
                                : IconFishmeetBreakroomTimerUnSelected } />
                        <Text style = { fishmeetStyles.timerOptionItemText }>{t('AutoCloseBreakRooms')}</Text>
                    </TouchableOpacity>

                    <View style = { fishmeetStyles.timerInputContainer as ViewStyle }>
                        <TextInput
                            keyboardType = 'numeric'
                            onChangeText = { setInputValue }
                            style = { fishmeetStyles.timerInputField as ViewStyle }
                            value = { inputValue } />
                        <Text style = { fishmeetStyles.timerOptionItemText }>{t('Minutes')}</Text>
                    </View>

                    <TouchableOpacity
                        onPress = { handleManualSelect }
                        style = { fishmeetStyles.timerManualOptionContainer as ViewStyle }>
                        <Icon
                            color = 'transparent'
                            size = { 18 }
                            src = { selectedOption === 'manual'
                                ? IconFishmeetBreakroomTimerSelected
                                : IconFishmeetBreakroomTimerUnSelected } />
                        <Text style = { fishmeetStyles.timerOptionItemText }>{t('ManuallyCloseBreakRooms')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress = { handleConfirm }
                        style = { fishmeetStyles.timerButton }>
                        <Text style = { fishmeetStyles.timerButtonText as ViewStyle }>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default FishMeetTimerOptions;
