import React from 'react';

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

const fishMeetIconState = {
    backgroundColor: '#C8D7EC',
    height: 37,
    width: 37,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
};

export const FishmeetAudioStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: (
        <Icon
            className = 'jitsi-icon-dominant-speaker'
            color = 'transparent'
            size = { 16 }
            src = { IconFishmeetMic }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = 'transparent'
            size = { 16 }
            src = { IconFishmeetMicSlash }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            color = 'transparent'
            size = { 16 }
            src = { IconFishmeetMicSlash }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            color = 'transparent'
            size = { 16 }
            src = { IconFishmeetMic }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.NONE]: null
};

export const FishmeetVideoStateIcons = {
    [MEDIA_STATE.DOMINANT_SPEAKER]: null,
    [MEDIA_STATE.FORCE_MUTED]: (
        <Icon
            color = 'transparent'
            id = 'videoMuted'
            size = { 16 }
            src = { IconFishmeetVideoOff }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.MUTED]: (
        <Icon
            color = 'transparent'
            id = 'videoMuted'
            size = { 16 }
            src = { IconFishmeetVideoOff }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.UNMUTED]: (
        <Icon
            color = 'transparent'
            size = { 16 }
            src = { IconFishmeetVideo }
            style = { fishMeetIconState as any } />
    ),
    [MEDIA_STATE.NONE]: null
};

/**
 * Mobile web context menu avatar size.
 */
export const AVATAR_SIZE = 20;
