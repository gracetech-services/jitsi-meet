import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import {
    getBreakoutRooms,
} from '../../../../../breakout-rooms/functions';

import Button from '../../../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../../../base/ui/constants.web';
import { autoAssignToBreakoutRooms } from '../../../../../breakout-rooms/actions';
import { createBreakoutRoom } from '../../../../../breakout-rooms/actions';

import { removeAllRoomAndAdd } from './functions';

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

        const nRooms = prompt(t('breakoutRooms.prompts.EnterTotalRoom'), `${nCurrentRooms}`);
        if (!nRooms) return;

        const nnn = parseInt(nRooms);
        if (nnn === 0) return;
        
        if (nnn >= nCurrentRooms) {
            while (nCurrentRooms < nnn) {
                dispatch(createBreakoutRoom());
                ++nCurrentRooms;
            }
            /* /// this is problematic, see CloseAllRoomsButton. First need to Close rooms that has people in it
            //  and then remove the room. There needs waiting in between close and remove rooms.
            // we simply will not cut down rooms, and let auto assign to all existing rooms if number of existing rooms
            // is larger. If the user wants to be exact, he should click on "Close All Room" and then attempt auto
            // assign again, that will get right.  === the user will learn this anyway, and this would not be the prime
            // scenario/concern
            while (nCurrentRooms > nnn) {
                const room = roomArr[--nCurrentRooms];
                //dispatch(closeBreakoutRoom(room[1].id)).then(()=>dispatch(removeBreakoutRoom(room[1].jid)));
                //dispatch(closeBreakoutRoom(room[1].id));
                dispatch(removeBreakoutRoom(room[1].jid));
            }
            */
            if (nCurrentRooms === roomArr.length)
                dispatch(autoAssignToBreakoutRooms());
            else {
                //needs time for the breakroom creation to be propagated in the states
                setTimeout(()=>wait2AutoAssign(nCurrentRooms), 100);
            }
        } else {
            //we'll close all rooms if there is too many, and then recreate
            removeAllRoomAndAdd(true, nnn);
            setTimeout(()=>wait2AutoAssign(nnn), 100);
        }

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
