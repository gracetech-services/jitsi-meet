import { size } from 'lodash-es';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../app/types';
import { getLocalParticipant, getRemoteParticipants } from '../../base/participants/functions';
import Button from '../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../base/ui/constants.web';
import { getBreakoutRooms } from '../../breakout-rooms/functions';
import { getSortedParticipantIds } from '../../participants-pane/functions';
import { getVisitorsList } from '../../visitors/functions';
import { setPresetBreakoutRoom } from '../actions';
import { getPresetBreakoutRoomData } from '../functions';

const useStyles = makeStyles()(theme => {
    return {
        button: {
            marginTop: theme.spacing(3)
        }
    };
});

export const LoadPresetBreakoutRoomButton = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const presetBreakoutRoomData = useSelector((state: IReduxState) => getPresetBreakoutRoomData(state));
    const rooms = useSelector((state: IReduxState) => getBreakoutRooms(state));
    const visitorsList = useSelector((state: IReduxState) => getVisitorsList(state));
    const sortedParticipantIds = useSelector((state: IReduxState) => getSortedParticipantIds(state));
    const remoteParticipants = useSelector((state: IReduxState) => getRemoteParticipants(state));
    const localParticipant = useSelector((state: IReduxState) => getLocalParticipant(state));

    const onAdd = useCallback(() => {
        console.log('[GTS] LoadPresetBreakoutRoomButton click', {
            presetBreakoutRoomData,
            rooms,
            visitorsList,
            sortedParticipantIds,
            remoteParticipants,
            localParticipant
        });

        if (size(rooms) > 1) {
            if (!confirm(t('presetBreakoutRooms.confirm.prompt'))) {
                return;
            }
        }

        dispatch(setPresetBreakoutRoom());
    }
    , [ dispatch, presetBreakoutRoomData, rooms, visitorsList, sortedParticipantIds ]);

    return (
        <Button
            accessibilityLabel = { t('presetBreakoutRooms.actions.load') }
            className = { classes.button }
            fullWidth = { true }
            labelKey = 'presetBreakoutRooms.actions.load'
            onClick = { onAdd }
            type = { BUTTON_TYPES.PRIMARY } />
    );
};

export default LoadPresetBreakoutRoomButton;
