import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Button from '../../../../../base/ui/components/web/Button';
import { BUTTON_TYPES } from '../../../../../base/ui/constants.web';
import { removeAllRoomAndAdd } from './functions';

export const CloseAllRoomsButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onCloseAll = useCallback(() => {
      removeAllRoomAndAdd(true, 0);
    }, [ dispatch ]);

    return (
        <Button
            accessibilityLabel = { t('breakoutRooms.actions.closeAll') }
            fullWidth = { true }
            labelKey = { 'breakoutRooms.actions.closeAll' }
            onClick = { onCloseAll }
            type = { BUTTON_TYPES.SECONDARY } />
    );
};
