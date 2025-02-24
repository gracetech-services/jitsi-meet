import BaseTheme from '../../../base/ui/components/BaseTheme.native';


/**
 * The style of the participants pane buttons.
 */
export const button = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
};

/**
 * The styles of the native components of the feature {@code participants}.
 */
export default {

    fishMeetParticipantContent: {
        alignItems: 'center',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },

    fishMeetRaisedHandIndicator: {
        backgroundColor: BaseTheme.palette.fishMeetMainColor01,
        borderRadius: BaseTheme.spacing[4] / 2,
        height: BaseTheme.spacing[4],
        width: BaseTheme.spacing[4],
        marginLeft: 'auto',
        marginRight: BaseTheme.spacing[3]
    },

    fishMeetParticipantsPaneContainer: {
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        flex: 1,
        flexDirection: 'column',
        paddingVertical: BaseTheme.spacing[2]
    },

    fishMeetInputContainer: {
        marginLeft: BaseTheme.spacing[1],
        marginRight: BaseTheme.spacing[3],
        marginBottom: BaseTheme.spacing[4]
    },

    fishMeetLeftInput: {
        paddingRight: BaseTheme.spacing[3],
        textAlign: 'left',
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        borderColor: '#fff',
        borderWidth: 0.5,
        borderRadius: 30
    },

    fishMeetIconState: {
        backgroundColor: BaseTheme.palette.fishMeetMainColor02,
        height: 37,
        width: 37,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
};
