import BaseTheme from '../../../base/ui/components/BaseTheme.native';

/**
 * The styles of the feature chat.
 *
 * NOTE: Sizes and colors come from the 8x8 guidelines. This is the first
 * component to receive this treating, if others happen to have similar, we
 * need to extract the brand colors and sizes into a branding feature (planned
 * for the future).
 */
export default {

    fishMeetRemoteMessageBubble: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 0
    },

    fishMeetChatMessage: {
        ...BaseTheme.typography.bodyShortRegular,
        color: BaseTheme.palette.fishMeetText02
    },

    fishMeetTimeText: {
        color: BaseTheme.palette.fishMeetMainColor02,
        fontSize: 13
    },

    fishMeetSenderDisplayName: {
        ...BaseTheme.typography.bodyShortBold,
        color: BaseTheme.palette.fishMeetText02
    },

    fishMeetLocalMessageBubble: {
        backgroundColor: BaseTheme.palette.fishMeetMainColor02,
        borderTopRightRadius: 0
    }
};

