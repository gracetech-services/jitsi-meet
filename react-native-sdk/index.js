/* eslint-disable lines-around-comment,  no-undef, no-unused-vars  */
// NB: This import must always come first.
import './react/bootstrap.native';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { appNavigate } from './react/features/app/actions.native';
import { App } from './react/features/app/components/App.native';
import { setAudioMuted, setVideoMuted } from './react/features/base/media/actions';
import { getRoomsInfo } from './react/features/breakout-rooms/functions';
/**
 * Main React Native SDK component that displays a Jitsi Meet conference and gets all required params as props
 */
export const JitsiMeeting = forwardRef((props, ref) => {
    const [ appProps, setAppProps ] = useState({});
    const app = useRef(null);
    const { config, eventListeners, flags, room, serverURL, style, token, userInfo } = props;

    // eslint-disable-next-line arrow-body-style
    useImperativeHandle(ref, () => ({
        close: () => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(appNavigate(undefined));
        },
        setAudioMuted: muted => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(setAudioMuted(muted));
        },
        setVideoMuted: muted => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(setVideoMuted(muted));
        },
        getRoomsInfo: () => {
            const state = app.current.state.store.getState();

            return getRoomsInfo(state);
        }
    }));
    useEffect(() => {
        const urlObj = {
            config,
            jwt: token
        };
        let urlProps;

        if (room.includes('://')) {
            urlProps = {
                ...urlObj,
                url: room
            };
        } else {
            urlProps = {
                ...urlObj,
                room,
                serverURL
            };
        }
        setAppProps({
            'flags': flags,
            'rnSdkHandlers': {
                onAudioMutedChanged: eventListeners?.onAudioMutedChanged,
                onVideoMutedChanged: eventListeners?.onVideoMutedChanged,
                onConferenceBlurred: eventListeners?.onConferenceBlurred,
                onConferenceFocused: eventListeners?.onConferenceFocused,
                onConferenceJoined: eventListeners?.onConferenceJoined,
                onConferenceWillJoin: eventListeners?.onConferenceWillJoin,
                onConferenceLeft: eventListeners?.onConferenceLeft,
                onEnterPictureInPicture: eventListeners?.onEnterPictureInPicture,
                onParticipantJoined: eventListeners?.onParticipantJoined,
                onParticipantLeft: eventListeners?.onParticipantLeft,
                onReadyToClose: eventListeners?.onReadyToClose,
                onEnterFloatMeetingInApp: eventListeners?.onEnterFloatMeetingInApp
            },
            'url': urlProps,
            'userInfo': userInfo
        });
    }, []);
    // eslint-disable-next-line arrow-body-style
    useLayoutEffect(() => {
        /**
         * When you close the component you need to reset it.
         * In some cases it needs to be added as the parent component may have been destroyed.
         * Without this change the call remains active without having the jitsi screen.
        */
        return () => {
            const dispatch = app.current?.state?.store?.dispatch;

            dispatch && dispatch(appNavigate(undefined));
        };
    }, []);

    return (<View style={style}>
        <App {...appProps} ref={app}/>
    </View>);
});
