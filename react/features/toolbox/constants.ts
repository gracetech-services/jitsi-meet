import { ToolbarButton } from './types';

/**
 * Thresholds for displaying toolbox buttons.
 */
export const THRESHOLDS = [
    {
        width: 565,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'audioonly', 'raisehand',
            'participants', 'recording', 'tileview' ]
    },
    {
        width: 520,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'audioonly', 'raisehand', 'participants', 'recording' ]
    },
    {
        width: 470,
        order: [ 'microphone', 'camera', 'desktop', 'chat', 'audioonly', 'raisehand', 'participants' ]
    },
    {
        width: 420,
        order: [ 'microphone', 'camera', 'chat', 'audioonly', 'raisehand', 'participants' ]
    },
    {
        width: 370,
        order: [ 'microphone', 'camera', 'chat', 'audioonly', 'participants', 'raisehand' ]
    },
    {
        width: 225,
        order: [ 'microphone', 'camera', 'chat', 'audioonly', 'participants' ]
    },
    {
        width: 200,
        order: [ 'microphone', 'camera', 'chat', 'audioonly', 'participants' ]
    }
];

export const NOT_APPLICABLE = 'N/A';

export const TOOLBAR_TIMEOUT = 4000;

export const DRAWER_MAX_HEIGHT = '80dvh - 64px';

// Around 300 to be displayed above components like chat
export const ZINDEX_DIALOG_PORTAL = 302;

/**
 * Color for spinner displayed in the toolbar.
 */
export const SPINNER_COLOR = '#929292';


/**
 * The list of all possible UI buttons.
 *
 * @protected
 * @type Array<string>
 */
export const TOOLBAR_BUTTONS: ToolbarButton[] = [
    'camera',
    'chat',
    'closedcaptions',
    'desktop',
    'download',
    'embedmeeting',
    'etherpad',
    'feedback',
    'filmstrip',
    'fullscreen',
    'hangup',
    'help',
    'highlight',
    'invite',
    'linktosalesforce',
    'livestreaming',
    'microphone',
    'mute-everyone',
    'mute-video-everyone',
    'participants-pane',
    'profile',
    'raisehand',
    'recording',
    'security',
    'select-background',
    'settings',
    'shareaudio',
    'noisesuppression',
    'sharedvideo',
    'shortcuts',
    'stats',
    'tileview',
    'toggle-camera',
    'videoquality',
    'whiteboard'
];

/**
 * The toolbar buttons to show when in visitors mode.
 */
export const VISITORS_MODE_BUTTONS: ToolbarButton[] = [
    'chat',
    'hangup',
    'raisehand',
    'settings',
    'tileview',
    'fullscreen',
    'stats',
    'videoquality'
];
