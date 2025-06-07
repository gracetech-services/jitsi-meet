/* eslint-disable lines-around-comment */

import React, { useCallback } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { appType } from '../../../base/config/AppType';
import { openDialog, openSheet } from '../../../base/dialog/actions';
import {
    BREAKOUT_ROOMS_BUTTON_ENABLED
} from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import Icon from '../../../base/icons/components/Icon';
import { IconDotsHorizontal, IconFishmeetDotsHorizontal, IconRingGroup } from '../../../base/icons/svg';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';
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
 * Implements the participants pane footer component.
 *
 * @returns { JSX.Element} - The participants pane footer component.
 */
const ParticipantsPaneFooter = (): JSX.Element => {
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
                isBreakoutRoomsSupported
                && isBreakoutRoomsEnabled
                && <Button
                    accessibilityLabel = 'participantsPane.actions.breakoutRooms'
                    // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
                    icon = { () =>
                        !appType.isFishMeet
                        && <Icon
                            color = { BaseTheme.palette.icon04 }
                            size = { 20 }
                            src = { IconRingGroup } />
                    }
                    labelKey = 'participantsPane.actions.breakoutRooms'
                    // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
                    onClick = { () => {
                        if (appType.isFishMeet) {
                            navigate(screen.conference.fishMeetBreakoutRooms);
                        } else {
                            navigate(screen.conference.breakoutRooms);
                        }
                    } }
                    style = { styles.breakoutRoomsButton }
                    type = { appType.isFishMeet ? BUTTON_TYPES.FISHMEET_SECONDARY : BUTTON_TYPES.SECONDARY } />
            }

            <View style = { styles.participantsPaneFooter as ViewStyle }>
                {
                    showMuteAll && (
                        <Button
                            accessibilityLabel = 'participantsPane.actions.muteAll'
                            labelKey = 'participantsPane.actions.muteAll'
                            onClick = { muteAll }
                            type = { appType.isFishMeet ? BUTTON_TYPES.FISHMEET_PRIMARY : BUTTON_TYPES.SECONDARY } />
                    )
                }
                <Button
                    accessibilityLabel = 'participantsPane.actions.stopEveryonesVideo'
                    labelKey = 'participantsPane.actions.stopEveryonesVideo'
                    onClick = { muteAllVideo }
                    style = { styles.moreButton }
                    type = { appType.isFishMeet ? BUTTON_TYPES.FISHMEET_PRIMARY : BUTTON_TYPES.SECONDARY } />
                {
                    showMoreActions && (
                        <IconButton
                            onPress = { openMoreMenu }
                            src = { appType.isFishMeet ? IconFishmeetDotsHorizontal : IconDotsHorizontal }
                            style = { styles.moreButton }
                            type = { appType.isFishMeet ? BUTTON_TYPES.FISHMEET_SECONDARY : BUTTON_TYPES.SECONDARY } />
                    )
                }
            </View>
        </View>
    );
};

export default ParticipantsPaneFooter;
