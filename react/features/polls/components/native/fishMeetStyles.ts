import { createStyleSheet } from '../../../base/styles/functions.native';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';


export const fishMeetDialogStyles = createStyleSheet({

    fishMeetInput: {
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        borderColor: BaseTheme.palette.fishMeetMainColor02,
        borderRadius: 40,
        borderWidth: 1,
        color: BaseTheme.palette.text01,
        paddingHorizontal: BaseTheme.spacing[3],
        height: BaseTheme.spacing[7],
        lineHeight: 20
    },

    fishMeetInputMultiline: {
        height: BaseTheme.spacing[8],
        paddingTop: BaseTheme.spacing[3]
    }
});

export const fishMeetChatStyles = createStyleSheet({

    fishMeetPollItemContainer: {
        backgroundColor: BaseTheme.palette.fishMeetText03,
        borderColor: BaseTheme.palette.fishMeetText03,
        borderRadius: 30,
        borderWidth: 1,
        padding: BaseTheme.spacing[4],
        margin: BaseTheme.spacing[3]
    },

    fishMeetPollPaneContainer: {
        backgroundColor: BaseTheme.palette.fishMeetUiBackground,
        flex: 1
    }
});
