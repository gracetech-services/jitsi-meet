import React, { useCallback, useState } from 'react';
import { GestureResponderEvent, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import Icon from '../../../base/icons/components/Icon';
import { IconFishmeetArrowDown, IconFishmeetArrowUp } from '../../../base/icons/svg';
import fishmeetStyles from '../../../breakout-rooms/components/native/fishmeetStyles';

interface IProps {

    /**
     * The children to be displayed within this list.
     */
    children: React.ReactNode;

    /**
     * Callback to invoke when the {@code CollapsibleList} is long pressed.
     */
    onLongPress?: (e?: GestureResponderEvent) => void;

    /**
     * Collapsible list title.
     */
    title: String;
}

const FishMeetCollapsibleList = ({ children, onLongPress, title }: IProps) => {
    const [ collapsed, setCollapsed ] = useState(false);
    const _toggleCollapsed = useCallback(() => {
        setCollapsed(!collapsed);
    }, [ collapsed ]);

    return (
        <View style={fishmeetStyles.collapsibleWrapper as ViewStyle}>
            <TouchableOpacity
                onLongPress={onLongPress}
                onPress={_toggleCollapsed}
                style={fishmeetStyles.collapsibleList as ViewStyle}>
                
                <Text style={fishmeetStyles.listTile as TextStyle}>
                    {title}
                </Text>

                {collapsed && (
                    <Icon
                    color = { 'transparent' }
                        size={25}
                        src={IconFishmeetArrowDown}
                        style={fishmeetStyles.arrowInlineRight as ViewStyle} />
                )}
            </TouchableOpacity>

            {!collapsed && (
                <>
                    {children}

                    <TouchableOpacity
                        onPress={_toggleCollapsed}
                        style={fishmeetStyles.arrowBottomRight as ViewStyle}>
                        <Icon
                        color = { 'transparent' }
                            size={25}
                            src={IconFishmeetArrowUp} />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default FishMeetCollapsibleList;