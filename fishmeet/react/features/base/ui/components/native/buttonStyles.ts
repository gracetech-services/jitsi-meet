import { BUTTON_TYPES } from '../../constants.native';
import BaseTheme from '../../../ui/components/BaseTheme.native';

const BUTTON_HEIGHT = BaseTheme.spacing[7];

const button = {
    borderRadius: BaseTheme.shape.borderRadius,
    display: 'flex',
    height: BUTTON_HEIGHT,
    justifyContent: 'center'
};

const buttonLabel = {
    ...BaseTheme.typography.bodyShortBold
};

// fishmeet: pill-shaped button
const fishMeetButton = {
    borderRadius: BUTTON_HEIGHT / 2.0,
    display: 'flex',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
};

export default {
    button: {
        ...button
    },

    buttonLabel: {
        ...buttonLabel
    },

    buttonLabelDisabled: {
        ...buttonLabel,
        color: BaseTheme.palette.text03
    },

    buttonContent: {
        height: BUTTON_HEIGHT
    },

    buttonDisabled: {
        ...button,
        backgroundColor: BaseTheme.palette.ui08
    },

    buttonLabelPrimary: {
        ...buttonLabel,
        color: BaseTheme.palette.text01
    },

    buttonLabelPrimaryText: {
        ...buttonLabel,
        color: BaseTheme.palette.action01
    },

    buttonLabelSecondary: {
        ...buttonLabel,
        color: BaseTheme.palette.text04
    },

    buttonLabelDestructive: {
        ...buttonLabel,
        color: BaseTheme.palette.text01
    },

    buttonLabelDestructiveText: {
        ...buttonLabel,
        color: BaseTheme.palette.actionDanger
    },

    buttonLabelTertiary: {
        ...buttonLabel,
        color: BaseTheme.palette.text01,
        marginHorizontal: BaseTheme.spacing[2],
        textAlign: 'center'
    },

    buttonLabelTertiaryDisabled: {
        ...buttonLabel,
        color: BaseTheme.palette.text03,
        textAlign: 'center'
    },

    // fishmeet button styles
    fishMeetButton: {
        ...fishMeetButton
    },

    fishMeetButtonDisabled: {
        ...fishMeetButton,
        backgroundColor: BaseTheme.palette.ui08
    },

    fishMeetButtonLabelPrimaryText: {
        ...buttonLabel,
        textTransform: 'capitalize',
        color: BaseTheme.palette.fishMeetText01
    },

    // fishmeet: type → background color map for FISHMEET_* button types
    fishMeetTypeColors: {
        [BUTTON_TYPES.FISHMEET_PRIMARY]: BaseTheme.palette.fishMeetMainColor01,
        [BUTTON_TYPES.FISHMEET_SECONDARY]: BaseTheme.palette.fishMeetAction01,
        [BUTTON_TYPES.FISHMEET_TERTIARY]: BaseTheme.palette.fishMeetMainColor02
    },

    // fishmeet: button types that render as TouchableHighlight instead of NativePaperButton
    touchableHighlightTypes: new Set([
        BUTTON_TYPES.DESTRUCTIVE,
        BUTTON_TYPES.SECONDARY,
        BUTTON_TYPES.FISHMEET_PRIMARY,
        BUTTON_TYPES.FISHMEET_SECONDARY,
        BUTTON_TYPES.FISHMEET_TERTIARY
    ])
};
