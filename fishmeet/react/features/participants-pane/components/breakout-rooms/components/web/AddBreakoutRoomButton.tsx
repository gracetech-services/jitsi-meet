import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { openDialog } from '../../../../../base/dialog/actions';
import Button from '../../../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../../../base/ui/constants.web';
import CreateBreakoutRoomDialog from '../../../../../breakout-rooms/components/web/CreateBreakoutRoomDialog';

const useStyles = makeStyles()(theme => {
    return {
        button: {
            marginTop: theme.spacing(3)
        }
    };
});

export const AddBreakoutRoomButton = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onAdd = useCallback(() =>
        dispatch(openDialog(CreateBreakoutRoomDialog))
    , [ dispatch ]);

    return (
        <Button
            accessibilityLabel = { t('breakoutRooms.actions.add') }
            className = { classes.button }
            fullWidth = { true }
            labelKey = { 'breakoutRooms.actions.add' }
            onClick = { onAdd }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};
