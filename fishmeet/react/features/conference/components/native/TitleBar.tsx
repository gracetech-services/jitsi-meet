import React from 'react';
import { connect } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { getConferenceName } from '../../../base/conference/functions';
import { isParticipantsPaneEnabled } from '../../../participants-pane/functions';
import { isRoomNameEnabled } from '../../../prejoin/functions.native';
import { isToolboxVisible } from '../../../toolbox/functions.native';

import TitleBarFishMeet from './TitleBarFishMeet';

interface IProps {
    _createOnPress: Function;
    _isParticipantsPaneEnabled: boolean;
    _meetingName: string;
    _roomNameEnabled: boolean;
    _visible: boolean;
}

const TitleBar = (props: IProps) => <TitleBarFishMeet { ...props } />;

function _mapStateToProps(state: IReduxState) {
    return {
        _isParticipantsPaneEnabled: isParticipantsPaneEnabled(state),
        _meetingName: getConferenceName(state),
        _roomNameEnabled: isRoomNameEnabled(state),
        _visible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(TitleBar);
