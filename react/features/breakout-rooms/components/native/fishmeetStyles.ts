import BaseTheme from '../../../base/ui/components/BaseTheme.native';


/**
 * The styles of the native components of the feature {@code breakout rooms}.
 */
export default {
    Button: {
        width: 80,
        height: 80,
        borderRadius: 40
    },

    ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30
    },

    collapsibleList: {
        alignItems: 'center',
        borderRadius: BaseTheme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme.spacing[7],
        marginHorizontal: BaseTheme.spacing[2],
        marginTop: BaseTheme.spacing[3]
    },

    normalList: {
        alignItems: 'center',
        borderRadius: BaseTheme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme.spacing[7],
        marginHorizontal: BaseTheme.spacing[2],
        marginTop: BaseTheme.spacing[3]
    },

    arrowIcon: {
        backgroundColor: 'transparent',
        height: BaseTheme.spacing[5],
        width: BaseTheme.spacing[5],
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    closeIcon: {
        backgroundColor: 'transparent',
        borderRadius: BaseTheme.spacing[7],
        borderWidth: 2,
        padding: 15,
        borderColor: BaseTheme.palette.fishMeetMainColor02,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    roomName: {
        fontSize: 15,
        color: BaseTheme.palette.text01,
        fontWeight: 'bold',
        marginLeft: BaseTheme.spacing[2]
    },

    listTile: {
        fontSize: 15,
        color: BaseTheme.palette.fishMeetMainColor02,
        fontWeight: 'bold',
        marginLeft: BaseTheme.spacing[2]
    },

    normalListTile: {
        flex: 1,
        fontSize: 15,
        borderRadius: 24,
        borderWidth: 2,
        padding: 14,
        borderColor: BaseTheme.palette.fishMeetMainColor02,
        color: BaseTheme.palette.fishMeetMainColor02,
        fontWeight: 'bold',
        marginLeft: BaseTheme.spacing[2],
        marginRight: BaseTheme.spacing[2]
    },

    fishMeetAutoAssignButton: {
        marginTop: BaseTheme.spacing[3],
        marginBottom: BaseTheme.spacing[3],
        marginHorizontal: BaseTheme.spacing[3]
    },

    fishMeetBreakoutRoomsContainer: {
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        paddingHorizontal: BaseTheme.spacing[3]
    },

    inputContainer: {
        marginLeft: BaseTheme.spacing[2],
        marginRight: BaseTheme.spacing[2],
        marginTop: BaseTheme.spacing[4]
    },

    centerInput: {
        paddingRight: BaseTheme.spacing[3],
        textAlign: 'center'
    }

};
