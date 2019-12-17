import React from 'react';
import styled from 'styled-components';
import Media from '@style/media';
import VideoCover from 'react-video-cover';

const introVideo = require('@video/wendy.mp4');

const IntroVideo = () => {
    return (
        <StyledIntroVideo>
            <VideoCover
                remeasureOnWindowResize={ true }
                videoOptions={{
                    src: introVideo,
                    autoPlay: true,
                    playsInline: true,
                    muted: true,
                    loop: true
                }} />
        </StyledIntroVideo>
    );
};

const StyledIntroVideo = styled.div`
    bottom: 0;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;

    video {
        display: none;

        ${Media.tablet`
            display: block;
        `}
    }
`;


export default IntroVideo;
