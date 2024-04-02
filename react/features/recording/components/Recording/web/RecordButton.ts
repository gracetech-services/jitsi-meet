import { connect } from 'react-redux';

import { IReduxState } from '../../../../app/types';
import { openDialog } from '../../../../base/dialog/actions';
import { translate } from '../../../../base/i18n/functions';
import AbstractRecordButton, {
    IProps,
    _mapStateToProps as _abstractMapStateToProps
} from '../AbstractRecordButton';

import StartRecordingDialog from './StartRecordingDialog';
import StopRecordingDialog from './StopRecordingDialog';

//Gractech
import { startLocalVideoRecording } from '../../../actions';


//Gracetech
import { isMobileBrowser } from '../../../../base/environment/utils';

/**
 * Button for opening a dialog where a recording session can be started.
 */
class RecordingButton extends AbstractRecordButton<IProps> {

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _onHandleClick() {
        //Gracetech -- we don't support recording on mobile devices
        if (isMobileBrowser()) {
            alert("Recording feature is only available on desktop through https://idigest.app");
            return;
        } 
        const { _isRecordingRunning, dispatch } = this.props;

        /*original code
        dispatch(openDialog(
            _isRecordingRunning ? StopRecordingDialog : StartRecordingDialog
        ));
        */

        //Gracetech: we skip the startRecordingDialog
        dispatch(_isRecordingRunning? openDialog(StopRecordingDialog) : startLocalVideoRecording(false));
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code RecordButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _fileRecordingsDisabledTooltipKey: ?string,
 *     _isRecordingRunning: boolean,
 *     _disabled: boolean,
 *     visible: boolean
 * }}
 */
export function _mapStateToProps(state: IReduxState) {
    const abstractProps = _abstractMapStateToProps(state);
    const { toolbarButtons } = state['features/toolbox'];
    const visible = Boolean(toolbarButtons?.includes('recording') && abstractProps.visible);

    return {
        ...abstractProps,
        visible
    };
}

export default translate(connect(_mapStateToProps)(RecordingButton));
