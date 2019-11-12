import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';
import { CSSTransition } from 'react-transition-group';
import Media from '@style/media';

import { SoulMachinesContext } from '@contexts/SoulMachines';

class PersonaVideo extends PureComponent {

    static contextType = SoulMachinesContext;

    constructor(props, context) {
        super(props, context);

        this.videoRef = React.createRef();

        this.handleResize = this.handleResize.bind(this);
        this.handleVideoPlaying = this.handleVideoPlaying.bind(this);

        this.state = {
            videoStarted: false
        };
    }

    componentDidMount() {
        this.updateVideoStream();

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        const { isConnected } = this.props;

        this.updateVideoStream();

        if (!isConnected) {
            this.setState({ videoStarted: false });
        }
    }

    handleResize() {
        const videoEl = this.videoRef.current;

        if (videoEl) {
            this.props.setVideoBounds(videoEl.clientWidth, videoEl.clientHeight);
        }
    }

    handleVideoPlaying() {
        const { videoStarted } = this.state;

        // Firefox will send multiple events
        if (videoStarted) {
            return;
        }	

        this.context.videoStart();

        this.setState({
            videoStarted: true
        });
    }

    updateVideoStream() {
        const videoEl = this.videoRef.current;

        if (videoEl) {
            this.props.setVideoBounds(videoEl.clientWidth, videoEl.clientHeight);

            if (videoEl.srcObject === null) {
                videoEl.srcObject = this.context.personaVideoObject;
            }
        }
    }

    render() {
        const { isConnected } = this.props;

        return (
            <CSSTransition in={ isConnected } timeout={ 500 } unmountOnExit classNames="video">
                <StyledPersonaVideo { ...this.props }>
                    <video ref={ this.videoRef } onPlaying={ this.handleVideoPlaying } autoPlay playsInline></video>
                </StyledPersonaVideo>
            </CSSTransition>
        );
    }
}

const StyledPersonaVideo = styled.div`
    bottom: ${props => props.isTranscriptOpen ? props.theme.splitHeight : 0};
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 0;

    video {
        width: 100%;
        height: 100%;
    }

    ${Media.tablet`
        bottom: 0;
    `}

    /* Enter/Exit animation */
    &.video-enter {
        opacity: 0;
    }

    &.video-enter-done,
    &.video-enter-active {
        opacity: 1;
    }

    &.video-exit {
        opacity: 1;
    }

    &.video-exit-done,
    &.video-exit-active {
        opacity: 0;
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        personaState: state.personaState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setVideoBounds: (width, height) => dispatch({
            type: ActionTypes.SET_VIDEO_BOUNDS,
            width: width,
            height: height
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonaVideo);


