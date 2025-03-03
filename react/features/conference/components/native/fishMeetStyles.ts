import BaseTheme from '../../../base/ui/components/BaseTheme.native';

const TITLE_BAR_BUTTON_SIZE = 24;

/**
 * The styles of the safe area view that contains the title bar.
 */
const titleBarSafeView = {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
};

/**
 * The styles of the feature conference.
 */
export default {

    /**
     * {@code Conference} Style.
     */
    fishMeetConference: {
        alignSelf: 'stretch',
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        flex: 1
    },

    fishMeetTitleBarButton: {
        iconStyle: {
            color: 'transparent',
            padding: 12,
            fontSize: TITLE_BAR_BUTTON_SIZE
        },
        underlayColor: 'transparent'
    },

    fishMeetTitleBarSafeViewColor: {
        ...titleBarSafeView,
        backgroundColor: BaseTheme.palette.fishMeetUiBackground
    },

    fishMeetRoomNameView: {
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 3,
        flexShrink: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },


    fishMeetRaisedHandsCountLabel: {
        alignItems: 'center',
        backgroundColor: BaseTheme.palette.fishMeetMainColor01,
        borderRadius: BaseTheme.shape.borderRadius,
        flexDirection: 'row',
        marginBottom: BaseTheme.spacing[0],
        marginLeft: BaseTheme.spacing[0]
    }
};
