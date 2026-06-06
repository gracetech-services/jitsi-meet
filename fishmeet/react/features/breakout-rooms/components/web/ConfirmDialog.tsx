import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../base/ui/components/web/Dialog';

interface IProps {
    msg: string;
    onSubmit: () => void;
    title?: string;
}

/**
 * Confirm dialog (Web platform).
 *
 * @param {IProps} props - Component props.
 * @returns {JSX.Element}
 */
export default function ConfirmDialog(props: IProps) {
    const { t } = useTranslation();
    const { title = t('dialog.confirm'), msg, onSubmit } = props;

    return (
        <Dialog
            ok = {{ translationKey: 'dialog.Ok' }}
            onSubmit = { onSubmit }
            title = { title }>
            <div>
                { msg }
            </div>
        </Dialog>
    );
}
