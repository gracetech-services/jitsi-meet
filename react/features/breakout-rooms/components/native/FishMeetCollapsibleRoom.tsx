import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { hideDialog, openDialog, openSheet } from '../../../base/dialog/actions';
import { determineIfMoveParticipantToMainroom, sendParticipantToRoom } from '../../../breakout-rooms/actions';
import { getAreAllRoomsOpen } from '../../../breakout-rooms/functions';
import { addParticipantToPreloadRoom } from '../../../breakout-rooms/preActions';
import { IParticipant } from '../../../breakout-rooms/preRoomData';
import FishMeetAddAvatarButton from '../../../participants-pane/components/native/FishMeetAddAvatarButton';
import FishMeetCollapsibleList from '../../../participants-pane/components/native/FishMeetCollapsibleList';
import { avatarGridConstants } from '../../../participants-pane/components/native/fishMeetStyles';
import { IRoom } from '../../types';

import FishMeetBreakoutRoomContextMenu from './FishMeetBreakoutRoomContextMenu';
import FishMeetBreakoutRoomParticipantItem from './FishMeetBreakoutRoomParticipantItem';
import FishmeetBreakoutRoomMemberSelect from './FishmeetBreakoutRoomMemberSelect';

interface IProps {

    /**
     * Room to display.
     */
    room: IRoom;

    roomId: string;
}

/**
 * Returns a key for a passed item of the list.
 *
 * @param {Object} item - The participant.
 * @returns {string} - The user ID.
 */
function _keyExtractor(item: any) {
    return item.jid;
}

export const FishMeetCollapsibleRoom = ({ room, roomId }: IProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const areAllRoomsOpen = useSelector(getAreAllRoomsOpen);
    const _openContextMenu = useCallback(() => {
        dispatch(openSheet(FishMeetBreakoutRoomContextMenu, { room }));
    }, [ room ]);


    const onClose = () => {
        dispatch(hideDialog());
    };

    const onAssign = (selectedParticipants: IParticipant[]) => {
        if (areAllRoomsOpen) {
            for (const item of selectedParticipants) {
                if (item.isSelected) {
                    dispatch(sendParticipantToRoom(item.jid, room.id ?? ''));
                } else {
                    dispatch(determineIfMoveParticipantToMainroom(item.jid, room.id ?? ''));

                }
            }
            dispatch(hideDialog());

        } else {
            dispatch(addParticipantToPreloadRoom(roomId, selectedParticipants));
            dispatch(hideDialog());
        }
    };

    const _addOrReduceAction = useCallback(() => {
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

/*                const fakeParticipants = Array.from({ length: 10 }, (_, i) => ({
    jid: `fake-jid-${i + 1}`,
    name: `假人${i + 1}`,
    avatarURL: '', 
    email: `fake${i + 1}@example.com`,
    isFake: true
}));
const participants = [
    ...fakeParticipants,
    ...Object.values(room.participants || [])
]; */
    const participants = Object.values(room.participants || []);

    const data = room.isMainRoom
        ? participants
        : [ ...participants, { isAddButton: true } ];

    return (
        <FishMeetCollapsibleList
            onLongPress = { _openContextMenu }
            title = { title }>
            <FlatList
                data = { data }
                keyExtractor = { _keyExtractor }

                /* @ts-ignore */
                listKey = { roomId as String }
                numColumns = { avatarGridConstants.NUM_COLUMNS }
                // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
                renderItem = { ({ item }) => {
                    if ('isAddButton' in item) {
                        return (
                            <FishMeetAddAvatarButton onPress = { _addOrReduceAction } />
                        );
                    }

                    return (
                        <FishMeetBreakoutRoomParticipantItem
                            item = { item }
                            room = { room } />
                    );
                } }
                scrollEnabled = { false }
                showsHorizontalScrollIndicator = { false }
                windowSize = { 2 } />
        </FishMeetCollapsibleList>
    );
};
