import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { hideDialog, openDialog, openSheet } from '../../../base/dialog/actions';
import { addParticipantToPreloadRoom, removePreloadBreakoutRoom } from '../../../breakout-rooms/preActions';
import FishMeetNormalList from '../../../participants-pane/components/native/FishMeetNormalList';
import {
    closeBreakoutRoom, determineInOtherRoomsSendParticipantToRoom,
    removeBreakoutRoom, sendParticipantToRoom
} from '../../actions';
import { getStartOpenAllRooms } from '../../functions';
import { IParticipant } from '../../preRoomData';
import { IRoom } from '../../types';

import BreakoutRoomContextMenu from './BreakoutRoomContextMenu';
import FishmeetBreakoutRoomMemberSelect from './FishmeetBreakoutRoomMemberSelect';


interface IProps {

    /**
     * Room to display.
     */
    room: IRoom;

    roomId: string;
}

export const FishMeetNormalRoom = ({ room, roomId }: IProps) => {
    const startOpenAllRooms = useSelector(getStartOpenAllRooms);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const _openContextMenu = useCallback(() => {
        dispatch(openSheet(BreakoutRoomContextMenu, { room }));
    }, [ room ]);

    const onClose = () => {
        dispatch(hideDialog());
    };

    const onAssign = (selectedParticipants: IParticipant[]) => {
        if (startOpenAllRooms) {
            for (const item of selectedParticipants) {
                if (item.isSelected) {
                    dispatch(sendParticipantToRoom(item.jid, room.id ?? ''));
                } else {
                    dispatch(determineInOtherRoomsSendParticipantToRoom(item.jid, room.id ?? ''));

                }
            }
            dispatch(hideDialog());

        } else {
            dispatch(addParticipantToPreloadRoom(roomId, selectedParticipants));
            dispatch(hideDialog());
        }
    };

    const _onDelete = useCallback(() => {

        if (startOpenAllRooms) {
            if (Object.keys(room.participants).length > 0) {
                dispatch(closeBreakoutRoom(room.id));
            } else {
                dispatch(removeBreakoutRoom(room.jid));
            }

        } else {
            dispatch(removePreloadBreakoutRoom(roomId));
        }
    }, [ startOpenAllRooms, roomId, dispatch ]);

    const _openMembertMenu = useCallback(() => {
        dispatch(openDialog(FishmeetBreakoutRoomMemberSelect, {
            room,
            onClose,
            onAssign
        }));
    }, [ room ]);

    const roomParticipantsNr = Object.values(room.participants || {}).length;
    const title
        = `${room.name
        || t('breakoutRooms.mainRoom')} (${roomParticipantsNr})`;

    return (
        <FishMeetNormalList
            onDelete = { _onDelete }
            onLongPress = { _openContextMenu }
            onPress = { _openMembertMenu }
            title = { title } />
    );
};
