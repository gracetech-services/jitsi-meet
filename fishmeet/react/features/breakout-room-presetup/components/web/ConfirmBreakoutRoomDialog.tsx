import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../base/ui/components/web/Dialog';

interface IProps {
    onSubmit: () => void;
}

/**
 * Confirm to close the existing room-splitting dialog box, Web platform.
 * When preset or auto breakout rooms are triggered, inform the user that all existing breakout rooms will be closed.
 *
 * @param {IProps} props - Component props.
 * @returns {JSX.Element}
 */
export default function ConfirmBreakoutRoomDialog({ onSubmit }: IProps) {
    const { t } = useTranslation();

    return (
        <Dialog
            ok = {{ translationKey: 'dialog.Ok' }}
            onSubmit = { onSubmit }
            titleKey = 'dialog.confirmCloseBreakoutRooms'>
            <div>
                { t('dialog.closeBreakoutRoomsWarning') }
            </div>
        </Dialog>
    );
}
