import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '../../base/ui/components/native/Button';
import { BUTTON_TYPES } from '../../base/ui/constants.native';

import styles from './styles';

/**
 * Button to set preset-breakout-rooms
 *
 * @returns {JSX.Element} - The add breakout room button.
 */
const AddBreakoutRoomButton = () => {
    const dispatch = useDispatch();

    const handleCLick = useCallback(() => {
        // Todo
    }
    , [ dispatch ]);

    return (
        <Button
            accessibilityLabel = 'presetBreakoutRooms.actions.load'
            labelKey = 'presetBreakoutRooms.actions.load'
            onClick = { handleCLick }
            style = { styles.button }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};

export default AddBreakoutRoomButton;
