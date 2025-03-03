import React from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { appType } from '../../../base/config/AppType';
import { IconFishmeetRaiseHand, IconRaiseHand } from '../../../base/icons/svg';
import Label from '../../../base/label/components/native/Label';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';

import fishMeetStyles from './fishMeetStyles';
import styles from './styles';

const RaisedHandsCountLabel = () => {
    const raisedHandsCount = useSelector((state: IReduxState) =>
        (state['features/base/participants'].raisedHandsQueue || []).length);

    return raisedHandsCount > 0 ? (
        <Label
            icon = { appType.isFishMeet ? IconFishmeetRaiseHand : IconRaiseHand }
            iconColor = { BaseTheme.palette.uiBackground }
            style = { appType.isFishMeet ? fishMeetStyles.fishMeetRaisedHandsCountLabel : styles.raisedHandsCountLabel }
            text = { `${raisedHandsCount}` }
            textStyle = { styles.raisedHandsCountLabelText } />
    ) : null;
};

export default RaisedHandsCountLabel;
