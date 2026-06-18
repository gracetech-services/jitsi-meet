import { MaterialTopTabBar, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React from 'react';
import {
    Route,
    TabBarItem,
    TabBarItemProps,
    TabDescriptor
} from 'react-native-tab-view';

type TabBarItemWithKey = TabBarItemProps<Route> & { key: string; };

// renderTabBarItem extracts key from the spread props object to satisfy React 19's
// requirement that key must be passed directly to JSX and not via object spread.
const renderTabBarItem = ({ key, ...itemProps }: TabBarItemWithKey) => (
    <TabBarItem
        key = { key }
        { ...itemProps } />
);

// Builds the per-route TabDescriptor options expected by react-native-tab-view v4 from the
// react-navigation descriptors. @react-navigation/material-top-tabs v6 still exposes the tab
// label/icon/badge through the legacy renderLabel/renderIcon/renderBadge props, which
// react-native-tab-view v4 no longer consumes: the v4 TabBar reads them from the `options`
// record (keyed by route.key) instead. Without this mapping the custom `tabBarLabel` (e.g.
// TabBarLabelCounter) registered via navigation.setOptions is never invoked and the tab labels
// are not rendered.
const buildTabBarOptions = (
        state: MaterialTopTabBarProps['state'],
        descriptors: MaterialTopTabBarProps['descriptors']
): Record<string, TabDescriptor<Route>> => {
    const options: Record<string, TabDescriptor<Route>> = {};

    for (const route of state.routes) {
        const routeOptions = descriptors[route.key]?.options;
        const title = routeOptions?.title ?? route.name;
        const tabBarLabel = routeOptions?.tabBarLabel;
        const tabBarLabelFn = typeof tabBarLabel === 'function' ? tabBarLabel : undefined;

        options[route.key] = {
            accessibilityLabel: routeOptions?.tabBarAccessibilityLabel,
            label: routeOptions?.tabBarShowLabel === false
                ? () => null
                : tabBarLabelFn
                    ? ({ focused, color, labelText }) => tabBarLabelFn({
                        children: labelText ?? title,
                        color,
                        focused
                    })
                    : undefined,
            labelAllowFontScaling: routeOptions?.tabBarAllowFontScaling,
            labelStyle: routeOptions?.tabBarLabelStyle,
            labelText: typeof tabBarLabel === 'string' ? tabBarLabel : title,
            testID: routeOptions?.tabBarTestID
        };
    }

    return options;
};

const ChatTabBar = (props: MaterialTopTabBarProps) => {
    const { state, descriptors } = props;

    const options = React.useMemo(
        () => buildTabBarOptions(state, descriptors),
        [ state, descriptors ]
    );

    return (
        <MaterialTopTabBar
            { ...props as any }
            options = { options }
            renderTabBarItem = { renderTabBarItem } />
    );
};

export default ChatTabBar;
