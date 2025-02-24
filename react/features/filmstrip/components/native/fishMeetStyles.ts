import BaseTheme from '../../../base/ui/components/BaseTheme.native';

const fishMeetIndicatorContainer = {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    height: 26,
    margin: 2,
    padding: 4
};

/**
 * The styles of the feature filmstrip.
 */
export default {

    fishMeetRaisedHandIndicator: {
        ...fishMeetIndicatorContainer,
        backgroundColor: BaseTheme.palette.fishMeetMainColor01
    },

    fishMeetThumbnailRaisedHand: {
        borderWidth: 2,
        borderColor: BaseTheme.palette.fishMeetMainColor01
    }
};
