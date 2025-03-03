import BaseTheme from '../../../ui/components/BaseTheme.native';

const BUTTON_HEIGHT = BaseTheme.spacing[7];

const fishMeetButton = {
    borderRadius: BUTTON_HEIGHT / 2.0,
    display: 'flex',
    height: BUTTON_HEIGHT,
    justifyContent: 'center'
};

const buttonLabel = {
    ...BaseTheme.typography.bodyShortBold,
    textTransform: 'capitalize'
};

export default {

    fishMeetButton: {
        ...fishMeetButton
    },

    fishMeetButtonDisabled: {
        ...fishMeetButton,
        backgroundColor: BaseTheme.palette.ui08
    },

    fishMeetButtonLabelPrimaryText: {
        ...buttonLabel,
        color: BaseTheme.palette.fishMeetText01
    }
};
