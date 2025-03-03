import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { appType } from '../../../base/config/AppType';
import Icon from '../../../base/icons/components/Icon';
import { IconFishmeetRaiseHand, IconRaiseHand } from '../../../base/icons/svg';

import fishMeetStyles from './fishMeetStyles';
import styles from './styles';

export const RaisedHandIndicator = () => (
    <View
        style = { (appType.isFishMeet
            ? fishMeetStyles.fishMeetRaisedHandIndicator
            : styles.raisedHandIndicator) as StyleProp<ViewStyle> }>
        <Icon
            size = { 16 }
            src = { appType.isFishMeet ? IconFishmeetRaiseHand : IconRaiseHand }
            style = { styles.raisedHandIcon } />
    </View>
);
