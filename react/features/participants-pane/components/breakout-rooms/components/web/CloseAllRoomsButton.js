import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import {
    getBreakoutRooms,
} from '../../../../../breakout-rooms/functions';

import Button from '../../../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../../../base/ui/constants.web';
import {closeBreakoutRoom, removeBreakoutRoom } from '../../../../../breakout-rooms/actions';

export const CloseAllRoomsButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onCloseAll = useCallback(() => {
        const rooms = getBreakoutRooms(APP.store);
        const roomArr = Object.entries(rooms).filter((room)=>!room[1].isMainRoom);
        console.log(rooms, roomArr);
        let nCurrentRooms = roomArr.length;
        console.log(rooms, roomArr, nCurrentRooms);

        while (nCurrentRooms > 0) {
            const room = roomArr[--nCurrentRooms];
            dispatch(closeBreakoutRoom(room[1].id)).then(()=>dispatch(removeBreakoutRoom(room[1].jid)));
            // the remove internally will also do close 
            //dispatch(removeBreakoutRoom(room[1].jid));
        }         
    }, [ dispatch ]);

    return (
        <Button
            accessibilityLabel = { t('breakoutRooms.actions.closeAll') }
            fullWidth = { true }
            labelKey = { 'breakoutRooms.actions.closeAll' }
            onClick = { onCloseAll }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};
