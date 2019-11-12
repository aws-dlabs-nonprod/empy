import React, { Component } from 'react';
import styled from 'styled-components';
import ReactSVG from 'react-svg';
import Media from '@style/media';

import { StyledLoader } from '@components/Loader';
import Tip, { StyledTip } from '@components/ButtonTip';

class Button extends Component {

    static defaultProps = {
        tip: null,
        toggleTip: null,
        tipPosition: 'left',
        isToggled: false,
        secondary: false,
        disabled: false,
        onClick: () => {}
    };

    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        e.preventDefault();

        this.props.onClick();
    }

    render() {
        const {
            children,
            className,
            icon,
            toggleIcon,
            tip,
            toggleTip,
            isToggled,
            disabled,
            tipPosition,
            tipBelow,
            theme
        } = this.props;

        const tipContent = isToggled ? (toggleTip || tip) : tip;
        const iconOption = isToggled ? (toggleIcon || icon) : icon;

        return (
            <button disabled={ disabled } aria-label={ tipContent } className={ className } onClick={ this.handleClick }>
                { iconOption && <ReactSVG src={ iconOption } /> }

                { children }

                { tipContent &&
                <Tip theme={ theme } tipPosition={ tipPosition } tipBelow={ tipBelow }>
                    <p>{ tipContent }</p>
                </Tip>
                }
            </button>
        );
    }
}

const BaseButton = styled(Button)`
    background: ${props => props.theme.colourPrimary};
    border-radius: ${props => props.theme.radius};
    box-sizing: border-box;
    color: ${props => props.theme.colourForeground};
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-size: 1.6rem;
    height: 4.8rem;
    border: ${props => `0.1rem solid ${props.theme.colourPrimary}`};
    margin: 0 0 2rem 0;
    outline: none;
    padding: 0 1.8rem;
    position: relative;
    width: 100%;
    z-index: 3;
    transition: background 0.2s ease, color 0.2s ease;

    ${Media.tablet`
        font-size: 1.8rem;
        padding: 0 2rem;
        width: 100%;

        &:hover {
            background: ${props => props.theme.colourPrimaryHover};
            
            svg {
                fill: ${props => props.theme.colourForeground};
            }

            ${StyledTip} {
                opacity: ${props => props.tip ? 1 : 0};
                transform: translateY(0);
            }
        }
    `}
`;

const SecondaryButton = styled(BaseButton)`
    background: ${props => props.theme.colourForeground};
    color: ${props => props.theme.textPrimary};

    ${Media.tablet`
        &:hover {
            color: ${props => props.theme.colourForeground};

            ${StyledLoader} {
                circle {
                    stroke: ${props => props.theme.colourForeground};
                }
            }
        }
    `}

    ${StyledLoader} {
        circle {
            stroke: ${props => props.theme.colourPrimary};
        }
    }
`;

const IconButton = styled(BaseButton)`
    background: ${props => props.theme.colourForegroundHover};
    border-color: ${props => props.isToggled ? props.theme.colourPrimary : props.theme.colourDivider};
    padding: 1.4rem 1.3rem;

    ${Media.tablet`
        padding: 1.4rem 1.3rem;

        &:hover {
            background: ${props => props.theme.colourForeground};

            svg {
                fill: ${props => props.theme.colourPrimary};
            }
        }
    `};

    /* Icons */
    svg {
        fill: ${props => props.theme.colourPrimary};
        height: 2rem;
        position: relative;
        width: 2rem;
    }
`;

const SmallIconButton = styled(IconButton)`
    height: 3rem;
    width: 3rem;

    ${Media.tablet`
        padding: 0.4rem;
        height: 3rem;
        width: 3rem;
    `};
`;

export default BaseButton;

export {
    BaseButton as Button,
    SecondaryButton,
    IconButton,
    SmallIconButton
};
