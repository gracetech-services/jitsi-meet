import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../app/types';
import { openDialog } from '../../base/dialog/actions';
import { toState } from '../../base/redux/functions';
import Button from '../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../base/ui/constants.web';
import AutoBreakoutRoomCountPrompt from '../../participants-pane/components/breakout-rooms/components/web/AutoBreakoutRoomCountPrompt';

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
    const { availableToAutoSetup } = useSelector((state: IReduxState) => toState(state)['features/breakout-room-autosetup']);

    const onAutoDiscussClick = useCallback(async () => {
        if (availableToAutoSetup) {
            return;
        }

        dispatch(openDialog(AutoBreakoutRoomCountPrompt));

    }, [
        availableToAutoSetup,
        dispatch,
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
