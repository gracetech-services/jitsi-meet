/* eslint-disable */

import React, { useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Button from "../../../../../base/ui/components/web/Button";
import { BUTTON_TYPES } from "../../../../../base/ui/constants.web";
import { removeAllRoomAndAdd } from "./functions";

interface IProps {
    className?: string;
}

export const CloseAllRoomsButton = ({ className }: IProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onCloseAll = useCallback(() => {
        removeAllRoomAndAdd(true, 0);
    }, [dispatch]);

    return (
        <Button
            accessibilityLabel={t("breakoutRooms.actions.closeAll")}
            className = { className }
            fullWidth={true}
            labelKey={"breakoutRooms.actions.closeAll"}
            onClick={onCloseAll}
            type={BUTTON_TYPES.SECONDARY}
        />
    );
};
