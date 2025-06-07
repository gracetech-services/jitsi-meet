import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import React, { useCallback, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { hideDialog, openDialog } from '../../../../../react/features/base/dialog/actions';
import { fishMeetPassInData } from '../../../base/config/FishMeetPassInData';
import { equals } from '../../../base/redux/functions';
import Button from '../../../base/ui/components/native/Button';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';
import {
    closeAllRooms, createBreakoutRoom,
    openAllRooms, setUploadResult, upLoadPreBreakRoomsData
} from '../../actions';
import { getAreAllRoomsOpen, getBreakoutRooms, getUploadResult } from '../../functions';
import { createPreloadBreakoutRoom, setLoadPreBreakoutRooms } from '../../preActions';
import { getAllRoomsData } from '../../preRoomData';

import FishMeetTimerOptions from './FishMeetTimerOptions';
import FishMeetToastView from './FishMeetToastView';
import fishmeetStyles from './fishmeetStyles';


/**
 * Button to add a breakout room.
 *
 * @returns {JSX.Element} - The add breakout room button.
 */
const FishMeetBreakRoomFooterButtons = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const areAllRoomsOpen = useSelector(getAreAllRoomsOpen);
    const uploadResult = useSelector(getUploadResult);
    const rooms = Object.values(useSelector(getBreakoutRooms, equals)).filter(room => !room.isMainRoom);

    const onClose = () => {
        dispatch(hideDialog());
    };

    useEffect(() => {
        if (uploadResult === undefined) {
            return;
        }
        const text = uploadResult ? t('breakoutRooms.saveSuccessBreakRooms') : t('breakoutRooms.saveFailBreakRooms');

        dispatch(openDialog(FishMeetToastView, {
            text,
            onClose
        }));
        dispatch(setUploadResult(undefined));

    }, [ uploadResult, dispatch ]);

    const onAdd = useCallback(() => {
        if (areAllRoomsOpen) {
            dispatch(createBreakoutRoom());
        } else {
            dispatch(createPreloadBreakoutRoom());
        }
    }, [ dispatch ]);

    const timerOptionsClose = (data: { option: 'manual'; } | { option: 'auto'; time: number; }) => {
        dispatch(hideDialog());
        if (data.option === 'auto') {
            // console.log('auto');
            // console.log('Time:', data.time);
            // TODO: Pass to server to setting time
        } else {
            dispatch(openAllRooms());
        }

    };

    const onSave = useCallback(() => {
        dispatch(upLoadPreBreakRoomsData(getAllRoomsData()));
    }, [ dispatch ]);

    const loadPreRooms = useCallback(() => {
        const preRoomData = fishMeetPassInData.breakRoomData;
        const copiedData = JSON.parse(JSON.stringify(preRoomData));

        dispatch(setLoadPreBreakoutRooms(copiedData));

    }, [ dispatch ]);

    const onOpenAll = useCallback(() => {

        if (areAllRoomsOpen) {
            dispatch(closeAllRooms(navigation));
        } else {
            dispatch(openDialog(FishMeetTimerOptions, { timerOptionsClose }));
        }

    }, [ dispatch ]
    );

    return (
        <View style = { fishmeetStyles.ButtonContainer as ViewStyle }>
            <Button
                accessibilityLabel = 'breakoutRooms.actions.add'
                labelKey = 'breakoutRooms.actions.add'
                onClick = { onAdd }
                style = { fishmeetStyles.Button }
                type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
            <Button
                accessibilityLabel = 'breakoutRooms.actions.loadPreBreakoutRoom'
                disabled = { areAllRoomsOpen || fishMeetPassInData.breakRoomData === undefined }
                labelKey = 'breakoutRooms.actions.loadPreBreakoutRoom'
                onClick = { loadPreRooms }
                style = { fishmeetStyles.Button }
                type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
            <Button
                accessibilityLabel = 'breakoutRooms.actions.save'
                disabled = { areAllRoomsOpen || rooms.length === 0 }
                labelKey = 'breakoutRooms.actions.save'
                onClick = { onSave }
                style = { fishmeetStyles.Button }
                type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
            <Button
                accessibilityLabel = { areAllRoomsOpen
                    ? 'breakoutRooms.actions.closeAll'
                    : 'breakoutRooms.actions.openAll' }
                disabled = { !areAllRoomsOpen && rooms.length === 0 }
                labelKey = { areAllRoomsOpen ? 'breakoutRooms.actions.closeAll' : 'breakoutRooms.actions.openAll' }
                onClick = { onOpenAll }
                style = { fishmeetStyles.Button }
                type = { BUTTON_TYPES.FISHMEET_PRIMARY } />
        </View>
    );
};

export default FishMeetBreakRoomFooterButtons;
