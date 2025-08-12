import { filter, size } from 'lodash-es';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../app/types';
import { toState } from '../../base/redux/functions';
import Button from '../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../base/ui/constants.web';
import { autoAssignToBreakoutRooms } from '../../breakout-rooms/actions';
import { getBreakoutRooms } from '../../breakout-rooms/functions';
import logger from '../../breakout-rooms/logger';
import { prepareReassignAdd, triggerReassign } from '../actions';

const useStyles = makeStyles()(theme => {
    return {
        button: {
            marginTop: theme.spacing(3)
        }
    };
});

export const AutoBreakoutRoomButton = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const rooms = useSelector((state: IReduxState) => getBreakoutRooms(state));
    const { availableToAutoSetup } = useSelector((state: IReduxState) => toState(state)['features/breakout-room-autosetup']);

    const onAutoDiscussClick = useCallback(async () => {
        if (availableToAutoSetup) {
            return;
        }

        const subRoomsSize = size(filter(rooms, room => !room.isMainRoom));
        const input = prompt(t('breakoutRooms.prompts.EnterTotalRoom'), `${subRoomsSize}`) ?? '';
        const shouldAssignRoomCount = parseInt(input, 10);

        if (!shouldAssignRoomCount || isNaN(shouldAssignRoomCount)) {
            return;
        }

        logger.debug('[GTS] AutoDiscuss click', { shouldAssignRoomCount, subRoomsSize });

        if (shouldAssignRoomCount > subRoomsSize) {
            dispatch(prepareReassignAdd({
                assignRoomCount: shouldAssignRoomCount - subRoomsSize
            }));
        } else if (shouldAssignRoomCount === subRoomsSize) {
            dispatch(autoAssignToBreakoutRooms());

        } else {
            // we'll close all rooms if there is too many, and then recreate
            dispatch(triggerReassign({ assignRoomCount: shouldAssignRoomCount }));
        }

    }, [
        availableToAutoSetup,
        dispatch,
        rooms,
    ]);

    return (
        <Button
            accessibilityLabel = { t('autoBreakoutRooms.actions.button') }
            className = { classes.button }
            fullWidth = { true }
            labelKey = 'autoBreakoutRooms.actions.button'
            onClick = { onAutoDiscussClick }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};

export default AutoBreakoutRoomButton;
