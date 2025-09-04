import React from 'react';
import { WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../../app/types';
import { translate } from '../../../i18n/functions';
import Icon from '../../../icons/components/Icon';
import { IconVideoStreamOff } from '../../../icons/svg';
import { getVideoStreamEnable } from '../../../video-stream/functions';

interface IProps extends WithTranslation {
    _enableVideoStream: boolean;
}

const useStyles = makeStyles()(theme => {
    return {
        root: {},

        streamStopCover: {
            position: 'absolute' as const,
            zIndex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: `${theme.palette.uiBackground}`,
            opacity: 0.8
        },

        streamStopIcon: {
            position: 'absolute' as const,
            top: 8,
            left: '50%',
            zIndex: 10,
            transform: 'translateX(-50%)'
        }
    };
});
const VideoStreamCover: React.FC<IProps> = props => {
    const { _enableVideoStream, t } = props;
    const { classes: styles } = useStyles();

    if (_enableVideoStream) {
        return null;
    }

    return (
        <>
            <div
                className = { styles.streamStopCover } />
            <span
                className = { styles.streamStopIcon }
                title = { t('videothumbnail.videoStreamOff') }>
                <Icon
                    alt = { t('videothumbnail.videoStreamOff') }
                    src = { IconVideoStreamOff } />
            </span>
        </>
    );

};

const _mapStateToProps = (state: IReduxState) => {
    const enableVideoStream = getVideoStreamEnable(state);

    return {
        _enableVideoStream: Boolean(enableVideoStream),
    };
};

export default connect(_mapStateToProps)(translate(VideoStreamCover));

