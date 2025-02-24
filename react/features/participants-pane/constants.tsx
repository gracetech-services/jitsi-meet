import React from 'react';
import { View, ViewStyle } from 'react-native';

import Icon from '../base/icons/components/Icon';
import {
    IconFishmeetMic,
    IconFishmeetMicSlash,
    IconFishmeetVideo,
    IconFishmeetVideoOff,
    IconMic,
    IconMicSlash,
    IconVideo,
    IconVideoOff
} from '../base/icons/svg';
import fishMeetStyles from '../participants-pane/components/native/fishMeetStyles';

/**
 * Reducer key for the feature.
 */
export const REDUCER_KEY = 'features/participants-pane';

export type ActionTrigger = 'Hover' | 'Permanent';

/**
 * Enum of possible participant action triggers.
 */
export const ACTION_TRIGGER: { HOVER: ActionTrigger; PERMANENT: ActionTrigger; } = {
    HOVER: 'Hover',
    PERMANENT: 'Permanent'
};

export type MediaState = 'DominantSpeaker' | 'Muted' | 'ForceMuted' | 'Unmuted' | 'None';

/**
 * Enum of possible participant media states.
 */
export const MEDIA_STATE: { [key: string]: MediaState; } = {
    DOMINANT_SPEAKER: 'DominantSpeaker',
    MUTED: 'Muted',
    FORCE_MUTED: 'ForceMuted',
    UNMUTED: 'Unmuted',
    NONE: 'None'
};

export type QuickActionButtonType = 'Mute' | 'AskToUnmute' | 'AllowVideo' | 'StopVideo' | 'None';

/**
 * Enum of possible participant mute button states.
 */
export const QUICK_ACTION_BUTTON: {
    ALLOW_VIDEO: QuickActionButtonType;
    ASK_TO_UNMUTE: QuickActionButtonType;
    MUTE: QuickActionButtonType;
    NONE: QuickActionButtonType;
    STOP_VIDEO: QuickActionButtonType;
} = {
    ALLOW_VIDEO: 'AllowVideo',
    MUTE: 'Mute',
    ASK_TO_UNMUTE: 'AskToUnmute',
    NONE: 'None',
    STOP_VIDEO: 'StopVideo'
};

/**
 * Icon mapping for possible participant audio states.
 */
export const AudioStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: (
        <Icon
            className = 'jitsi-icon-dominant-speaker'
            size = { 16 }
            src = { IconMic } />
    ),
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = '#E04757'
            size = { 16 }
            src = { IconMicSlash } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            size = { 16 }
            src = { IconMicSlash } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            size = { 16 }
            src = { IconMic } />
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * Icon mapping for possible participant video states.
 */
export const VideoStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: null,
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = '#E04757'
            id = 'videoMuted'
            size = { 16 }
            src = { IconVideoOff } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            id = 'videoMuted'
            size = { 16 }
            src = { IconVideoOff } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            size = { 16 }
            src = { IconVideo } />
    ),
    [MEDIA_STATE.NONE]: null
};

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
                color = 'transparent'
                size = { 16 }
                src = { IconFishmeetVideo } />
        </View>
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * Mobile web context menu avatar size.
 */
export const AVATAR_SIZE = 20;
