import React from 'react';
import styled from 'styled-components';
import Media from '@style/media';

const tipPosition = (props, values) => {
    switch (props.tipPosition) {
        default:
        case 'left':
            return values[0];

        case 'center':
            return values[1];

        case 'right':
            return values[2];
    }
};

const ButtonTip = (props) => {
    const {
        children
    } = props;

    return (
        <StyledButtonTip { ...props }>
            { children }
        </StyledButtonTip>
    );
};

const StyledButtonTip = styled.div`
    background: ${props => props.theme.textBody};
    border-radius: ${props => props.theme.radius};
    bottom: 5rem;
    color: ${props => props.theme.colourForeground};
    display: ${props => props.isHidden ? 'none' : 'block'};
    opacity: 0;
    font-size: 1rem;
    font-weight: 700;
    left: ${props => tipPosition(props, ['0', 'auto', 'auto'])};
    right: ${props => tipPosition(props, ['auto', 'auto', '0'])};
    line-height: 1.22;
    padding: 1rem;
    pointer-events: none;
    position: absolute;
    text-align: left;
    transition: opacity 0.2s ease-in-out;
    transition-property: opacity, transform;
    white-space: nowrap;
    transform: translateY(10%);
    will-change: opacity, transform;

    ${Media.tablet`
        font-size: 1.2rem;
        bottom: ${props => props.tipBelow ? '-5rem' : '6.2rem' };
    `}

    &:before,
    &:after {
        border-left: 0.7rem solid transparent;
        border-right: 0.7rem solid transparent;
        border-top: 0.7rem solid ${props => props.theme.textBody};
        bottom: -0.7rem;
        content: '';
        display: block;
        width: 0;
        height: 0;
        left: ${props => tipPosition(props, ['1.2rem', '0', 'auto'])};
        right: ${props => tipPosition(props, ['auto', '0', '1.2rem'])};
        margin: ${props => tipPosition(props, ['0', '0 auto', '0'])};
        position: absolute;

        ${Media.desktop`
            left: ${props => tipPosition(props, ['1.8rem', '0', 'auto'])};
            right: ${props => tipPosition(props, ['auto', '0', '1.8rem'])};
            bottom: ${props => props.tipBelow ? '3.3rem' : '-0.7rem' };
            transform: ${props => props.tipBelow ? 'rotate(180deg)' : 'none' };
        `}
    }

    &:before {
        display: none;

        ${Media.desktop`
            display: ${props => props.tipBelow ? 'block' : 'none'};
            bottom: 3.4rem;
        `}
    }
`;

export default ButtonTip;

export {
    ButtonTip as Tip,
    StyledButtonTip as StyledTip
};
