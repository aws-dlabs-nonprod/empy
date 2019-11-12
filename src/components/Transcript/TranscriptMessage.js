import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { animationDelay } from '@style/helpers';
import Media from '@style/media';
import { InfoPanel } from '@components/InfoPanel';
import ReactSVG from 'react-svg';
import Source from '@constants/Source';

const iconInfo = require('@svg/icon-info.svg');
const wendyAvatar = require('@img/wendy.jpg');

class TranscriptMessage extends Component {

    static defaultProps = {
        loading: false,
        source: Source.PERSONA,
        content: '',
        panel: null,
        onPanelChange: null
    };

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleContentResize = this.handleContentResize.bind(this);
    }

    handleContentResize() {
        const { onContentResize } = this.props;

        if (onContentResize) {
            onContentResize();
        }
    }

    handlePanelChange(direction) {
        const { onPanelChange } = this.props;

        if (onPanelChange) {
            onPanelChange(direction);
        }
    }

    render() {
        const {
            source,
            content,
            loading,
            panel,
            totalPanelCount,
            id,
            activePanelIndex
        } = this.props;

        const isMine = source === Source.ME;
        const isInfoPanel = (source === Source.PERSONA && panel);

        return (
            <StyledTranscriptMessage id={ id } isMine={ isMine } isInfoPanel={ isInfoPanel } isLoading={ loading }>
                { !isMine &&
                <div className="avatar">
                    { isInfoPanel && <ReactSVG src={ iconInfo } /> }
                </div>
                }

                { !loading && !panel &&
                <div className="body">
                    <p>{ content }</p>
                </div>
                }

                { !loading && panel !== null &&
                    <InfoPanel
                        panel={ panel }
                        activePanelIndex={ panel.index }
                        totalPanelCount={ totalPanelCount }
                        isOpen={ true }
                        isActive={ activePanelIndex === panel.index }
                        onPanelChange={ this.handlePanelChange }
                        onContentResize={ this.handleContentResize }
                    />
                }

                { loading &&
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                }
            </StyledTranscriptMessage>
        );
    }
}

const loadingAnimation = keyframes`
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
`;

const StyledTranscriptMessage = styled.div`
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 0 1.5rem 0;
    padding: ${props => !props.isMine ? '0 6rem 0 0' : '0 1.5rem 0 5.5rem' };
    width: 100%;
    box-sizing: border-box;
    justify-content: ${props => !props.isMine ? 'flex-start' : 'flex-end'};

    ${Media.tablet`
        margin: 0 0 3rem 0;
        padding: ${props => !props.isMine ? '0 4rem 0 0' : props.isInfoPanel ? '0 1.5rem 0 0' : '0 0 0 4rem' };
    `}
    
    .avatar {
        align-items: center;
        background: ${props => props.isMine || props.isInfoPanel ? 'none' : `url(${wendyAvatar}) no-repeat 50% 50%` };
        background-size: cover;
        background-color: ${props => props.isInfoPanel ? props.theme.colourForeground : props.theme.colourBackground};
        border-radius: 50%;
        border: ${props => props.isMine ? 'none' : `0.1rem solid ${props.theme.colourDivider}`};
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        font-size: 1rem;
        height: 4rem;
        justify-content: center;
        margin: 0 1.5rem 0 0;
        text-transform: uppercase;
        width: 4rem;

        ${Media.tablet`
            width: 5rem;
            height: 5rem;
        `}

        div {
            height: 2rem;
        }

        svg {
            width: 2rem;
            height: 2rem;
            fill: ${props => props.theme.colourPrimary};
        }
    }

    .body {
        box-sizing: border-box;
        background: ${props => props.theme.colourForeground};
        border-radius: 1.2rem;
        color: ${props => props.theme.textPrimary};
        padding: 1.5rem 2rem;
        border: 0.1rem solid ${props => props.isMine ? props.theme.textDark : props.theme.colourDivider};
    }

    .loading {
        height: 0.8rem;
        border-radius: ${props => props.theme.radius};
        color: ${props => props.theme.textPrimary};
        padding: 1.6rem 0;
        font-size: 0;
        line-height: 0;

        ${Media.tablet`
            padding: 2.1rem 0;
        `}

        span {
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            background: ${props => props.theme.textDark};
            border-radius: 50%;
            margin: 0 1rem 0 0;

            animation: ${loadingAnimation} 1s ease-in-out infinite alternate;
            ${animationDelay([0, 0.2, 0.4])}

            &:last-child {
                margin: 0;
            }
        }
    }

    &.item-enter {
        opacity: 0;
        transform: translateY(2rem);
    }

    &.item-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
        transition-delay: ${props => props.isLoading ? '300ms' : '0ms'};
        transform-origin: 0% 0%;
    }

    &.item-exit {
        opacity: 1;
        transform: translateY(0);
    }

    &.item-exit-active {
        opacity: 0;
        transform: translateY(2rem);
        transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
        transition-delay: ${props => props.isLoading ? '300ms' : '0ms'};
        transform-origin: 0% 0%;
    }
`;

export default TranscriptMessage;
