// Ranger add the line below: Skip verification of variables reserved but not used by Gracetech.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { setAudioOnly, toggleAudioOnly } from '../../../base/audio-only/actions';
import { AUDIO_ONLY_BUTTON_ENABLED } from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import { translate } from '../../../base/i18n/functions';
import { IconAudioOnly, IconAudioOnlyOff } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';

/**
 * The type of the React {@code Component} props of {@link AudioOnlyButton}.
 */
interface IProps extends AbstractButtonProps {

    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean;
}

/**
 * An implementation of a button for toggling the audio-only mode.
 */
class AudioOnlyButton extends AbstractButton<IProps> {
    accessibilityLabel = 'toolbar.accessibilityLabel.audioOnly';
    icon = IconAudioOnly;
    label = 'toolbar.audioOnlyOn';
    toggledIcon = IconAudioOnlyOff;
    toggledLabel = 'toolbar.audioOnlyOff';
    tooltip = 'toolbar.accessibilityLabel.audioOnly';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;

        dispatch(toggleAudioOnly());
    }


    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._audioOnly;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AudioOnlyButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @private
 * @returns {{
 *     _audioOnly: boolean
 * }}
 */
function _mapStateToProps(state: IReduxState) {
    const { enabled: audioOnly } = state['features/base/audio-only'];

    // const enabledInFeatureFlags = getFeatureFlag(state, AUDIO_ONLY_BUTTON_ENABLED, true);
    // const visible = enabledInFeatureFlags;

    return {
        _audioOnly: Boolean(audioOnly)

        // visible
    };
}

export default translate(connect(_mapStateToProps)(AudioOnlyButton));
