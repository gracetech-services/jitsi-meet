import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '../../base/icons/components/Icon';
import { IconCloseLarge } from '../../base/icons/svg';

import { styleHeader } from './components/conference/components/fishMeetNavigationStyles';

export const fishMeetHeaderOptions = {
    header: ({ navigation, options }: any) => {
        const { top } = useSafeAreaInsets();

        return (
            <View style = { [ styleHeader.viewStyle as ViewStyle, { paddingTop: top } ] }>
                <Text>{' '}</Text>
                <Text style = { styleHeader.textStyle }>
                    { options.title }
                </Text>
                <TouchableOpacity
                    // eslint-disable-next-line react/jsx-no-bind
                    onPress = { () => navigation.goBack() }
                    // eslint-disable-next-line react-native/no-inline-styles
                    style = { [ styleHeader.touchStyle as ViewStyle ] }>
                    <Icon
                        size = { 16 }
                        src = { IconCloseLarge } />
                </TouchableOpacity>
            </View>
        );
    }
};
