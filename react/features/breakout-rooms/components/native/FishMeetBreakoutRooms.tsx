import React, { useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import JitsiScreen from '../../../base/modal/components/JitsiScreen';
import { isLocalParticipantModerator } from '../../../base/participants/functions';
import LoadingIndicator from '../../../base/react/components/native/LoadingIndicator';
import TintedView from '../../../base/react/components/native/TintedView';
import { equals } from '../../../base/redux/functions';
import {
    getBreakoutRooms,
    getIsShowLoading,
    getMainRoom,
    getStartOpenAllRooms,
    isAddBreakoutRoomButtonVisible,
    isAutoAssignParticipantsVisible
} from '../../functions';
import { addParticipantToPreloadMainRoom } from '../../preActions';

import FishMeetAutoAssignButton from './FishMeetAutoAssignButton';
import FishMeetBreakRoomFooterButtons from './FishMeetBreakRoomFooterButtons';
import { FishMeetCollapsibleRoom } from './FishMeetCollapsibleRoom';
import { FishMeetNormalRoom } from './FishMeetNormalRoom';
import fishmeetStyles from './fishmeetStyles';


const FishMeetBreakoutRooms = () => {

    const isBreakoutRoomsSupported = useSelector((state: IReduxState) =>
        state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported());
    const isLocalModerator = useSelector(isLocalParticipantModerator);
    const keyExtractor = useCallback((e: undefined, i: number) => i.toString(), []);

    const rooms = Object.values(useSelector(getBreakoutRooms, equals)).filter(room => !room.isMainRoom)
        .sort((p1, p2) => (p1?.name || '').localeCompare(p2?.name || ''));
    const showAddBreakoutRoom = useSelector(isAddBreakoutRoomButtonVisible);
    const showAutoAssign = useSelector(isAutoAssignParticipantsVisible);
    const mainRoom = useSelector(getMainRoom);
    const startOpenAllRooms = useSelector(getStartOpenAllRooms);
    const isShowLoading = useSelector(getIsShowLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!startOpenAllRooms) {
            dispatch(addParticipantToPreloadMainRoom());
        }

    }, [ dispatch ]);

    return (
        <>
            <JitsiScreen
                footerComponent = { isLocalModerator && showAddBreakoutRoom
                    ? FishMeetBreakRoomFooterButtons : undefined }
                style = { fishmeetStyles.fishMeetBreakoutRoomsContainer }>
                { /* Fixes warning regarding nested lists */}
                <FlatList
                    /* eslint-disable react/jsx-no-bind */
                    ListHeaderComponent = { () => (
                        <>
                            {mainRoom && <FishMeetCollapsibleRoom
                                key = { mainRoom.id }
                                room = { mainRoom }
                                roomId = { mainRoom.id } />
                            }
                            {
                                isBreakoutRoomsSupported
                                && rooms.map(room => (<FishMeetNormalRoom
                                    key = { room.id }
                                    room = { room }
                                    roomId = { room.id } />))
                            }
                            {rooms.length > 0 && showAutoAssign && !startOpenAllRooms && <FishMeetAutoAssignButton />}
                        </>
                    ) }
                    data = { [] as ReadonlyArray<undefined> }
                    keyExtractor = { keyExtractor }
                    renderItem = { null }
                    windowSize = { 2 } />
            </JitsiScreen>
            {isShowLoading
                && <TintedView>
                    <LoadingIndicator />
                </TintedView>
            }
        </>
    );
};

export default FishMeetBreakoutRooms;

