import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '../../../base/ui/components/native/Button';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';
import { autoPreAssignToBreakoutRooms } from '../../preActions';

import fishmeetStyles from './fishmeetStyles';

/**
 * Button to auto assign participants to breakout rooms.
 *
 * @returns {JSX.Element} - The auto assign button.
 */
const AutoAssignButton = () => {
    const dispatch = useDispatch();

    const onAutoAssign = useCallback(() => {
        dispatch(autoPreAssignToBreakoutRooms());
    }, [ dispatch ]);

    return (
        <Button
            accessibilityLabel = 'breakoutRooms.actions.autoAssign'
            labelKey = 'breakoutRooms.actions.autoAssign'
            onClick = { onAutoAssign }
            style = { fishmeetStyles.fishMeetAutoAssignButton }
            type = { BUTTON_TYPES.FISHMEET_SECONDARY } />
    );
};

export default AutoAssignButton;
