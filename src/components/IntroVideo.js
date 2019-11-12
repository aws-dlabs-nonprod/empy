import React from 'react';
import styled from 'styled-components';
import Media from '@style/media';

const introVideo = require('@video/wendy.mp4');

const IntroVideo = () => {
    return (
        <StyledIntroVideo>
            <video loop autoPlay playsInline muted src={ introVideo } />
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
        height:100%;
        object-fit: cover;
        width:100%;

        ${Media.tablet`
            display: block;
        `}
    }
`;


export default IntroVideo;
