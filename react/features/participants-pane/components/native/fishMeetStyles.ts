import { Dimensions } from 'react-native';

import BaseTheme from '../../../base/ui/components/BaseTheme.native';


/**
 * The style of the participants pane buttons.
 */
export const button = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 5;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = ((SCREEN_WIDTH - ITEM_MARGIN) * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export const avatarGridConstants = {
    ITEM_WIDTH,
    ITEM_MARGIN,
    NUM_COLUMNS
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
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: BaseTheme.palette.fishMeetAction01,
        width: '85%',
        height: 476,
        borderRadius: 22,
        padding: 24
    },
    title: {
        color: '#424350',
        fontSize: 18,
        marginBottom: 12
    },
    searchBox: {
        height: 40,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#424350',
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    list: {
        height: 235,
        marginBottom: 20
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    listText: {
        color: '#424350',
        fontSize: 16,
        marginLeft: 15
    },
    button: {
        backgroundColor: BaseTheme.palette.fishMeetMainColor02,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center'
    },
    buttonText: {
        color: BaseTheme.palette.fishMeetText01,
        fontSize: 16
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10
    },


    toastContainerModalContent: {
        backgroundColor: BaseTheme.palette.fishMeetAction01,
        width: '85%',
        borderRadius: 22,
        height: 99,
        padding: 16
    },

    toastText: {
        color: '#424350',
        fontSize: 16,
        marginBottom: 12,
        fontWeight: '600'
    },
    toastButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8
    },
    toastButtonText: {
        color: '#424350',
        fontSize: 16,
        alignSelf: 'flex-end'
    },


    timerContainerModalContent: {
        backgroundColor: BaseTheme.palette.fishMeetAction01,
        width: '85%',
        borderRadius: 30,
        padding: 24
    },

    timerOptionsText: {
        color: '#424350',
        fontSize: 18,
        fontWeight: '600',
        position: 'absolute',
        top: 30,
        left: 30
    },

    timerAutoOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 62
    },

    timerManualOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30
    },

    timerOptionItemText: {
        color: '#424350',
        fontSize: 16,
        marginLeft: 12
    },

    timerInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },

    timerInputField: {
        marginLeft: 30,
        width: 36,
        height: 19,
        borderWidth: 1,
        borderColor: '#424350',
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 12,
        marginRight: 6
    },

    timerButton: {
        marginTop: 40,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#C8D7EC'
    },

    timerButtonText: {
        color: '#424350',
        fontSize: 16,
        alignSelf: 'center'
    },

    avatarItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: ITEM_WIDTH,
        margin: ITEM_MARGIN
    },

    avatarName: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center'
    },

    disableAvatarName: {
        color: '#808080',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center'
    },

    addAvatarContainer: {
        alignItems: 'center',
        width: 50,
        margin: 10
    },

    addAvatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 50 * 0.5,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },

    addAvatarPlus: {
        fontSize: 32,
        color: '#555',
        fontWeight: 'bold'
    }
};
