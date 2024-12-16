import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { NativeModules, Platform } from 'react-native';
import { PIP_ENABLED, PIP_WHILE_SCREEN_SHARING_ENABLED } from '../../../base/flags/constants';

import { ENTER_FLOAT_MEETING_IN_APP } from '../actionTypes';
import { IReduxState } from '../../../app/types';
import { IconArrowDown } from '../../../base/icons/svg';
import { connect } from 'react-redux';
import { enterPictureInPicture } from '../actions';
import { getFeatureFlag } from '../../../base/flags/functions';
import { isLocalVideoTrackDesktop } from '../../../base/tracks/functions.native';
import { translate } from '../../../base/i18n/functions';

interface IProps extends AbstractButtonProps {

    /**
     * Whether Picture-in-Picture is enabled or not.
     */
    _enabled: boolean;
}

/**
 * An implementation of a button for entering Picture-in-Picture mode.
 */
class PictureInPictureButton extends AbstractButton<IProps> {
    accessibilityLabel = 'toolbar.accessibilityLabel.pip';
    icon = IconArrowDown;
    label = 'toolbar.pip';

    /**
     * Handles clicking / pressing the button.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        // this.props.dispatch(enterPictureInPicture());
        this.props.dispatch({ type: ENTER_FLOAT_MEETING_IN_APP });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render() {
        return this.props._enabled ? super.render() : null;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code PictureInPictureButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _enabled: boolean
 * }}
 */
function _mapStateToProps(state: IReduxState) {
    const pipEnabled = Boolean(getFeatureFlag(state, PIP_ENABLED));
    const pipWhileScreenSharingEnabled = getFeatureFlag(state, PIP_WHILE_SCREEN_SHARING_ENABLED, false);

    let enabled = pipEnabled && (!isLocalVideoTrackDesktop(state) || pipWhileScreenSharingEnabled);

    // Override flag for Android, since it might be unsupported.
    if (Platform.OS === 'android' && !NativeModules.PictureInPicture.SUPPORTED) {
        enabled = false;
    }

    return {
        _enabled: enabled
    };
}

export default translate(connect(_mapStateToProps)(PictureInPictureButton));
