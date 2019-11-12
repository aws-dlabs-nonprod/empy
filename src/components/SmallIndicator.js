import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Media from '@style/media';

import { animationDelay } from '@style/helpers';

class SmallIndicator extends Component {
    render() {
        return (
            <StyledSmallIndicator { ...this.props }>
                <span></span>
                <span></span>
                <span></span>
            </StyledSmallIndicator>
        );
    }
}

const idleAnimation = keyframes`
    0% {
        transform: scale(0.7);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
`;

const speakingAnimation = (scale) => {
    return keyframes`
        0% {
            height: 0.5rem;
        }

        100% {
            height: ${scale}rem;
        }
    `;
};

const StyledSmallIndicator = styled.div`
    height: 5rem;
    width: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    ${Media.tablet`
        height: 5rem;
        width: auto;
    `}

    span {
        display: block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 1rem;
        background: ${props => props.isAnimating ? props.theme.colourPrimary : props.theme.colourInactive };
        margin: 0 0.2rem;
        transform: translateY(0rem);
        transition: transform 0.2s ease-in-out, background-color 0.3s ease-in-out;
        animation-name: ${props => props.isAnimating ? speakingAnimation(1.2) : idleAnimation };
        animation-duration: ${props => props.isAnimating ? '0.3s' : '1.2s' };
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        will-change: transform, height;

        ${animationDelay([0, 0.1, 0.2, 0.3])};

        &:nth-child(2){
            animation-name: ${props => props.isAnimating ? speakingAnimation(2) : idleAnimation };
        }
    }
`;

export default SmallIndicator;

export {
    SmallIndicator,
    StyledSmallIndicator
};
