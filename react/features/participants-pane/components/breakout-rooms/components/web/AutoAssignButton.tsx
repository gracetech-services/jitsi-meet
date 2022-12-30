import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import {
    getBreakoutRooms,
} from '../../../../../breakout-rooms/functions';

import Button from '../../../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../../../base/ui/constants.web';
import { autoAssignToBreakoutRooms } from '../../../../../breakout-rooms/actions';
import {createBreakoutRoom, closeBreakoutRoom, removeBreakoutRoom } from '../../../../../breakout-rooms/actions';


export const AutoAssignButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const wait2AutoAssign = (fixRoomNum: number) => {
        const rooms = getBreakoutRooms(APP.store);
        const roomArr = Object.entries(rooms).filter((room)=>!room[1].isMainRoom);
        if (fixRoomNum === roomArr.length) {
            dispatch(autoAssignToBreakoutRooms());
        } 
        else {
            setTimeout(()=>wait2AutoAssign(fixRoomNum), 100);
        }
    }

    const onAutoAssign = useCallback(() => {
        //we should prompt "how many room", and then
        //auto add that many room, and then auto assign.
        //so that if there is 100 people, it takes a 50 room
        //input, and all is automated. 
        //or 30 people, split into pairs of 15 room.
        //this feature,

        const rooms = getBreakoutRooms(APP.store);
        const roomArr = Object.entries(rooms).filter((room)=>!room[1].isMainRoom);
        let nCurrentRooms = roomArr.length;
        console.log(rooms, roomArr, nCurrentRooms);

        const nRooms = prompt("Enter the number of rooms for auto break out. Cancel to auto assign to existing breakout rooms");    
        if (nRooms) {
            const nnn = parseInt(nRooms);
            if (nnn > 0) {
                while (nCurrentRooms < nnn) {
                    dispatch(createBreakoutRoom());
                    ++nCurrentRooms;
                }         
                while (nCurrentRooms > nnn) {
                    const room = roomArr[--nCurrentRooms];
                    dispatch(closeBreakoutRoom(room[1].id)).then(()=>dispatch(removeBreakoutRoom(room[1].jid)));
                    //dispatch(closeBreakoutRoom(room[1].id));
                    //dispatch(removeBreakoutRoom(room[1].jid));
                }         
            }
        }

        if (nCurrentRooms === roomArr.length)
            dispatch(autoAssignToBreakoutRooms());
        else 
            setTimeout(()=>wait2AutoAssign(nCurrentRooms), 100);
    }, [ dispatch ]);

    return (
        <Button
            accessibilityLabel = { t('breakoutRooms.actions.autoAssign') }
            fullWidth = { true }
            labelKey = { 'breakoutRooms.actions.autoAssign' }
            onClick = { onAutoAssign }
            type = { BUTTON_TYPES.SECONDARY } />
    );
    //it was TERTIARY, but made SECONDARY, in above, to make the button more prominent
    //type = { BUTTON_TYPES.TERTIARY } />
};
