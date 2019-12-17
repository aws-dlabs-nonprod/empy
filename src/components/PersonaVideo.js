import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import Media from '@style/media';
import { CameraPosition } from '@utils/camera';
import { calculateCameraPosition } from '@utils/camera';

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
        const videoEl = this.videoRef.current;
        const { isConnected, isTranscriptOpen, showWayfinders } = this.props;

        this.updateVideoStream();

        if (!isConnected) {
            this.setState({ videoStarted: false });
        }

        // Work out the new camera pan
        if (prevProps.isTranscriptOpen !== isTranscriptOpen ||
            prevProps.showWayfinders !== showWayfinders) {

            let newPosition = CameraPosition.CENTER;

            if (isTranscriptOpen) {
                newPosition = CameraPosition.RIGHT;
            } else if (showWayfinders) {
                newPosition = CameraPosition.LEFT;
            }

            if (videoEl) {
                const cameraPosition = calculateCameraPosition(
                    videoEl.clientWidth,
                    videoEl.clientHeight,
                    newPosition
                );

                this.context.animateCamera(cameraPosition);
            }
        }
    }

    handleResize() {
        const videoEl = this.videoRef.current;

        if (videoEl) {
            this.context.resizeCamera(
                videoEl.clientWidth * window.devicePixelRatio,
                videoEl.clientHeight * window.devicePixelRatio
            );
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
            this.context.resizeCamera(
                videoEl.clientWidth * window.devicePixelRatio,
                videoEl.clientHeight * window.devicePixelRatio
            );

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
    bottom: ${props => props.isPersonaVideoShrunk ? props.theme.splitHeight : 0};
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.5s 0s ease-in-out;
    z-index: 0;

    video {
        width: 100%;
        height: 100%;
    }

    ${Media.desktop`
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
        isPersonaVideoShrunk: state.isPersonaVideoShrunk,
        isConnected: state.isConnected,
        personaState: state.personaState,
        isTranscriptOpen: state.isTranscriptOpen,
        showWayfinders: state.showWayfinders
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonaVideo);


