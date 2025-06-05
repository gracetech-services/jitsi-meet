import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { openSheet } from '../../../base/dialog/actions';
import FishMeetCollapsibleList from '../../../participants-pane/components/native/FishMeetCollapsibleList';
import { IRoom } from '../../types';

import FishMeetBreakoutRoomContextMenu from './FishMeetBreakoutRoomContextMenu';
import FishMeetBreakoutRoomParticipantItem from './FishMeetBreakoutRoomParticipantItem';

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
    const _openContextMenu = useCallback(() => {
        dispatch(openSheet(FishMeetBreakoutRoomContextMenu, { room }));
    }, [ room ]);
    const roomParticipantsNr = Object.values(room.participants || {}).length;
    const title
        = `${room.name
        || t('breakoutRooms.mainRoom')} (${roomParticipantsNr})`;

    return (
        <FishMeetCollapsibleList
            onLongPress = { _openContextMenu }
            title = { title }>
            <FlatList
                data = { Object.values(room.participants || {}) }
                keyExtractor = { _keyExtractor }

                /* @ts-ignore */
                listKey = { roomId as String }

                // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
                renderItem = { ({ item: participant }) => (
                    <FishMeetBreakoutRoomParticipantItem
                        item = { participant }
                        room = { room } />
                ) }
                scrollEnabled = { false }
                showsHorizontalScrollIndicator = { false }
                windowSize = { 2 } />
        </FishMeetCollapsibleList>
    );
};
