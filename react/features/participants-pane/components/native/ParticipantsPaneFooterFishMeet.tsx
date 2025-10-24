/* eslint-disable lines-around-comment */

import React, { useCallback } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { openDialog, openSheet } from '../../../base/dialog/actions';
import {
    BREAKOUT_ROOMS_BUTTON_ENABLED
} from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import { IconFishmeetDotsHorizontal } from '../../../base/icons/svg';
import Button from '../../../base/ui/components/native/Button';
import IconButton from '../../../base/ui/components/native/IconButton';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';
import {
    navigate
} from '../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
// @ts-ignore
import MuteEveryoneDialog from '../../../video-menu/components/native/MuteEveryoneDialog';
import MuteEveryonesVideoDialog
    from '../../../video-menu/components/native/MuteEveryonesVideoDialog';
import { isMoreActionsVisible, isMuteAllVisible } from '../../functions';

import { ContextMenuMore } from './ContextMenuMore';
import styles from './styles';


/**
 * Implements the FishMeet participants pane footer component.
 *
 * @returns { JSX.Element} - The FishMeet participants pane footer component.
 */
const ParticipantsPaneFooterFishMeet = (): JSX.Element => {
    const dispatch = useDispatch();
    const isBreakoutRoomsSupported = useSelector((state: IReduxState) =>
        state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported()
    );
    const isBreakoutRoomsEnabled = useSelector((state: IReduxState) =>
        getFeatureFlag(state, BREAKOUT_ROOMS_BUTTON_ENABLED, true)
    );
    const openMoreMenu = useCallback(() => dispatch(openSheet(ContextMenuMore)), [ dispatch ]);
    const muteAll = useCallback(() => dispatch(openDialog(MuteEveryoneDialog)),
        [ dispatch ]);
    const showMoreActions = useSelector(isMoreActionsVisible);
    const showMuteAll = useSelector(isMuteAllVisible);

    // Gracetech
    const muteAllVideo = useCallback(() => {
        dispatch(openDialog(MuteEveryonesVideoDialog));
    }, [ dispatch ]);

    return (
        <View style = { styles.participantsPaneFooterContainer as ViewStyle }>
            {
                // Temporarily disable this feature via styles.breakoutRoomsButton
                isBreakoutRoomsSupported
                && isBreakoutRoomsEnabled
                && <Button
                    accessibilityLabel = 'participantsPane.actions.breakoutRooms'
                    labelKey = 'participantsPane.actions.breakoutRooms'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { () => navigate(screen.conference.fishMeetBreakoutRooms) }
                    style = { styles.breakoutRoomsButton }
                    type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
            }

            <View style = { styles.participantsPaneFooter as ViewStyle }>
                {
                    showMuteAll && (
                        <Button
                            accessibilityLabel = 'participantsPane.actions.muteAll'
                            labelKey = 'participantsPane.actions.muteAll'
                            onClick = { muteAll }
                            type = { BUTTON_TYPES.FISHMEET_PRIMARY } />
                    )
                }
                <Button
                    accessibilityLabel = 'participantsPane.actions.stopEveryonesVideo'
                    labelKey = 'participantsPane.actions.stopEveryonesVideo'
                    onClick = { muteAllVideo }
                    style = { styles.moreButton }
                    type = { BUTTON_TYPES.FISHMEET_PRIMARY } />
                {
                    showMoreActions && (
                        <IconButton
                            onPress = { openMoreMenu }
                            src = { IconFishmeetDotsHorizontal }
                            style = { styles.moreButton }
                            type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
                    )
                }
            </View>
        </View>
    );
};

export default ParticipantsPaneFooterFishMeet;

