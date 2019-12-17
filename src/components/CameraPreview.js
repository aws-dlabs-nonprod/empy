import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import SmallIndicator, { StyledSmallIndicator } from '@components/SmallIndicator';

import Media from '@style/media';

class CameraPreview extends Component {

    constructor() {
        super();

        this.videoRef = React.createRef();

        this.handleToggleVideoCollapse = this.handleToggleVideoCollapse.bind(this);
        this.handleUserMedia = this.handleUserMedia.bind(this);

        this.stream = null;
    }

    handleToggleVideoCollapse() {
        this.props.toggleVideoCollapse();
    }

    handleUserMedia(stream) {
        this.stream = stream;

        const videoEl = this.videoRef.current;

        if (videoEl) {
            videoEl.srcObject = stream;
        }
    }

    componentDidMount() {
        const { hasCamera } = this.props;

        if (hasCamera) {
            const requestedMedia = {
                video: true
            };

            navigator.mediaDevices.getUserMedia(requestedMedia)
                .then((stream) => {
                    this.handleUserMedia(stream);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    componentWillUnmount() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }

    render() {
        const { hasCamera, isUserSpeaking, isMuted } = this.props;

        return (
            <StyledCameraPreview { ...this.props }>
                { hasCamera &&
                    <Fragment>
                        <div className="video">
                            <video
                                ref={ this.videoRef }
                                muted
                                autoPlay
                                playsInline
                            ></video>
                        </div>
                    </Fragment>
                }

                <SmallIndicator isAnimating={ isUserSpeaking && !isMuted } />
            </StyledCameraPreview>
        );
    }
}

const StyledCameraPreview = styled.div`
    height: ${props => props.hasCamera ? props.isVideoCollapsed ? '6rem' : '6rem' : '4rem'};;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    width: ${props => props.hasCamera ? props.isVideoCollapsed ? '5rem' : '6rem' : '4rem'};;

    .video {
        display: ${props => props.isVideoCollapsed ? 'none' : 'flex'};
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: ${props => props.theme.radius};
        border: 0.2rem solid ${props => props.isUserSpeaking ? props.theme.colourPrimary : props.theme.colourDivider};
        transition: border-color 0.3s ease-in-out;
        overflow: hidden;

        ${Media.desktop`
            display: flex;
        `};
    }

    ${Media.desktop`
        display: flex;
        height: ${props => props.hasCamera ? props.isVideoCollapsed ? '7.5rem' : '12rem' : '5rem'};
        right: 3rem;
        top: 3rem;
        width: ${props => props.hasCamera ? props.isVideoCollapsed ? '5rem' : '10rem' : '4.8rem'};
    `}

    ${StyledSmallIndicator} {
        width: 100%;
        bottom: 0;
        position: absolute;
        height: ${props => props.hasCamera ? '3rem' : '4rem'};

        ${Media.desktop`
            height: 5rem;
        `};
    }

    video {
        display: ${props => props.isVideoCollapsed ? 'none' : 'block'};
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .collapse {
        display: none;

        svg {
            height: 0.3rem;
            top: -1rem;
        }

        ${Media.desktop`
            display: block;
            left: 1rem;
            top: 1rem;
            height: 1.5rem;
            z-index: 4;
        `};
    }
`;

export default CameraPreview;
