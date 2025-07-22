import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import InputDialog from '../../../base/dialog/components/native/InputDialog';
import { IBreakoutRoomNamePromptProps as IProps } from '../../../participants-pane/types';
import { renameBreakoutRoom } from '../../actions';
import { appType } from '../../../base/config/AppType';


/**
 * Implements a component to render a breakout room name prompt.
 *
 * @param {IProps} props - The props of the component.
 * @returns {JSX.Element}
 */
interface IExtendedProps extends IProps {
    onSubmit?: (name: string) => void;
}

export default function BreakoutRoomNamePrompt({
    breakoutRoomJid,
    initialRoomName,
    onSubmit
}: IExtendedProps) {
    const dispatch = useDispatch();

    const _onSubmit = useCallback((roomName: string) => {
        const formatted = roomName.trim();

        if (!formatted) {
            return false;
        }

        if (appType.isFishMeet && onSubmit) {

            onSubmit(formatted);
        } else {

            dispatch(renameBreakoutRoom(breakoutRoomJid, formatted));
        }

        return true;
    }, [ breakoutRoomJid, dispatch, onSubmit ]);

    return (
        <InputDialog
            descriptionKey = 'dialog.renameBreakoutRoomTitle'
            initialValue   = { initialRoomName?.trim() }
            onSubmit       = { _onSubmit } />
    );
}
