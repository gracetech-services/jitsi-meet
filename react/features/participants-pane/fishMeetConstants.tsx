import React from 'react';
import { View, ViewStyle } from 'react-native';

import Icon from '../base/icons/components/Icon';
import {
    IconFishmeetMic,
    IconFishmeetMicSlash,
    IconFishmeetVideo,
    IconFishmeetVideoOff
} from '../base/icons/svg';

import fishMeetStyles from './components/native/fishMeetStyles';
import { MEDIA_STATE } from './constants';

/**
 * FishMeet icon mapping for possible participant audio states.
 */
export const FishmeetAudioStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                className = 'jitsi-icon-dominant-speaker'
                color = 'transparent'
                size = { 16 }
                src = { IconFishmeetMic } />
        </View>
    ),
    [MEDIA_STATE.FORCE_MUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                color = 'transparent'
                size = { 16 }
                src = { IconFishmeetMicSlash } />
        </View>
    ),
    [MEDIA_STATE.MUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                color = 'transparent'
                size = { 16 }
                src = { IconFishmeetMicSlash } />
        </View>
    ),
    [MEDIA_STATE.UNMUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                color = 'transparent'
                size = { 16 }
                src = { IconFishmeetMic } />
        </View>
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * FishMeet icon mapping for possible participant video states.
 */
export const FishmeetVideoStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: null,
    [MEDIA_STATE.FORCE_MUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                color = 'transparent'
                id = 'videoMuted'
                size = { 16 }
                src = { IconFishmeetVideoOff } />
        </View>
    ),
    [MEDIA_STATE.MUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                color = 'transparent'
                id = 'videoMuted'
                size = { 16 }
                src = { IconFishmeetVideoOff } />
        </View>
    ),
    [MEDIA_STATE.UNMUTED]: (
        <View style = { fishMeetStyles.fishMeetIconState as ViewStyle }>
            <Icon
                size = { 16 }
                src = { IconFishmeetVideo } />
        </View>
    ),
    [MEDIA_STATE.NONE]: null
};

