import { t } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Icon from '../../../base/icons/components/Icon';
import {
    IconFishmeetBreakroomBlackClose,
    IconFishmeetParticipantSelect,
    IconFishmeetParticipantUnSelect
} from '../../../base/icons/svg';
import fishmeetStyles from '../../../participants-pane/components/native/fishMeetStyles';
import { getAreAllRoomsOpen, getBreakoutRooms } from '../../functions';
import { IParticipant, getParticipants, getParticipantsNotInRoom } from '../../preRoomData';
import { IRoom, IRooms } from '../../types';

interface IProps {
    onAssign: (selectedParticipants: IParticipant[]) => void;
    onClose: () => void;
    room: IRoom;
}

const FishmeetBreakoutRoomMemberSelect = ({ room, onClose, onAssign }: IProps) => {

    const areAllRoomsOpen = useSelector(getAreAllRoomsOpen);

    const getAllParticipantsDict = (
            allRoomsData: IRooms,
            currentRoomId: string
    ): { [key: string]: IParticipant & { isSelected: boolean; }; } =>
        Object.values(allRoomsData).reduce((acc, item) => {
            const isCurrentRoom = item.id === currentRoomId;

            Object.entries(item.participants).forEach(([ jid, participant ]) => {
                acc[jid] = {
                    ...participant,
                    isSelected: isCurrentRoom,
                    isNotInMeeting: false,
                    role: participant.role as 'participant' | 'moderator'
                };
            });

            return acc;
        }, {} as { [key: string]: IParticipant & { isSelected: boolean; }; });

    let participantsDict = {};

    if (areAllRoomsOpen) {
        const allRooms = useSelector(getBreakoutRooms);

        participantsDict = getAllParticipantsDict(allRooms, room.id);

    } else {
        participantsDict = {
            ...Object.entries(getParticipants(room.id) || {}).reduce((acc, [ jid, participant ]) => {
                acc[jid] = {
                    ...participant,
                    isSelected: true
                };

                return acc;
            }, {} as { [key: string]: IParticipant & { isSelected: boolean; }; }),

            ...Object.entries(getParticipantsNotInRoom(room.id) || {}).reduce((acc, [ jid, participant ]) => {
                acc[jid] = {
                    ...participant,
                    isSelected: false
                };

                return acc;
            }, {} as { [key: string]: IParticipant & { isSelected: boolean; }; })
        };
    }

    const unsortedParticipants = Object.values(participantsDict) as (IParticipant & { isSelected: boolean; })[];

    const participants = unsortedParticipants.sort(
        (a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0)
    );

    const [ selectedParticipants, setSelectedParticipants ] = useState<IParticipant[]>(participants);
    const [ searchText, setSearchText ] = useState('');

    const handleSelectParticipant = useCallback((jid: string) => () => {
        setSelectedParticipants(prevParticipants =>
            prevParticipants.map(participant => {
                return {
                    ...participant,
                    isSelected: participant.jid === jid ? !participant.isSelected : participant.isSelected
                };
            })
        );
    }, []);

    const handleAssign = useCallback(() => {
        onAssign(selectedParticipants);
    }, [ onAssign, selectedParticipants ]);

    const filteredParticipants = useMemo(() => {
        const lowerSearch = searchText.toLowerCase();

        return selectedParticipants.filter(participant => {
            const name = participant.displayName || '';

            return name.toLowerCase().includes(lowerSearch);
        });
    }, [ searchText, selectedParticipants ]);

    const renderItem = useCallback(({ item }: { item: IParticipant; }) => (
        <View style = { fishmeetStyles.listItem as ViewStyle }>
            <TouchableOpacity onPress = { handleSelectParticipant(item.jid) }>
                <Icon
                    color = 'transparent'
                    size = { 16 }
                    src = { item.isSelected ? IconFishmeetParticipantSelect : IconFishmeetParticipantUnSelect } />
            </TouchableOpacity>
            <Text style = { fishmeetStyles.listText }>
                {item.displayName + (item.isNotInMeeting ? t('breakoutRooms.notInMeeting') : '')}</Text>
        </View>
    ), [ handleSelectParticipant ]);
    const keyExtractor = useCallback((item: IParticipant) => item.jid, []);

    return (
        <View style = { fishmeetStyles.modalContainer as ViewStyle }>
            <View style = { fishmeetStyles.modalContent as ViewStyle }>

                <TouchableOpacity
                    onPress = { onClose }
                    style = { fishmeetStyles.closeButton as ViewStyle }>
                    <Icon
                        color = '#424350'
                        size = { 20 }
                        src = { IconFishmeetBreakroomBlackClose } />
                </TouchableOpacity>

                <Text style = { fishmeetStyles.title }>{room.name}</Text>

                <TextInput
                    onChangeText = { setSearchText }
                    placeholder = { t('breakoutRooms.searchParticipants') }
                    style = { fishmeetStyles.searchBox }
                    value = { searchText } />

                <FlatList
                    data = { filteredParticipants }
                    keyExtractor = { keyExtractor }
                    renderItem = { renderItem }
                    style = { fishmeetStyles.list } />

                <TouchableOpacity
                    onPress = { handleAssign }
                    style = { fishmeetStyles.button as ViewStyle }>
                    <Text style = { fishmeetStyles.buttonText }>{t('breakoutRooms.actions.assign')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FishmeetBreakoutRoomMemberSelect;
