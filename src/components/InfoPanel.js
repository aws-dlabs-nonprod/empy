import React, { Component } from 'react';
import styled from 'styled-components';
import Media from '@style/media';
import ReactSVG from 'react-svg';
import { CSSTransition } from 'react-transition-group';
import Lightbox from 'lightbox-react';

import { IconButton } from '@components/Button';
const iconClose = require('@svg/icon-close.svg');

const iconArrow = require('@svg/icon-arrow.svg');

class InfoPanel extends Component {

    constructor() {
        super();

        this.state = {
            isExpanded: false
        };

        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleLightboxClose = this.handleLightboxClose.bind(this);
        this.handleLightboxOpen = this.handleLightboxOpen.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
    }

    handleImageLoad(event) {
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

    handleLightboxClose() {
        this.setState({
            isExpanded: false
        });
    }

    handleLightboxOpen() {
        this.setState({
            isExpanded: true
        });
    }

    render() {
        const { className, isOpen } = this.props;

        return (
            <CSSTransition in={ isOpen } unmountOnExit timeout={ 200 } classNames="panel">
                <div className={ className }>
                    { this.renderContent() }
                    { this.renderFooter() }
                </div>
            </CSSTransition>
        );
    }

    renderContent() {
        const { panel } = this.props;

        switch (panel.type) {
            default:
            case 'text':
                return this.renderTextContent(panel.data);

            case 'image':
                return this.renderImageContent(panel.data);

            case 'link':
                return this.renderLinkContent(panel.data);
        }
    }

    renderTextContent() {
        const { panel } = this.props;

        return (
            <article className="panel-text">
                <p dangerouslySetInnerHTML={{ __html: panel.data.text }}></p>
            </article>
        );
    }

    renderLinkContent() {
        const { panel } = this.props;

        return (
            <article className="panel-link">
                <p><a href={ panel.data.url } target="_blank">{ panel.data.label }</a></p>
            </article>
        );
    }

    renderImageContent() {
        const { panel } = this.props;
        const { isExpanded } = this.state;

        return (
            <article className="panel-image">
                <img src={ panel.data.url } onLoad={ this.handleImageLoad } onClick={ this.handleLightboxOpen } />

                { isExpanded && <Lightbox
                    mainSrc={ panel.data.url }
                    enableZoom={ false }
                    onCloseRequest={ this.handleLightboxClose }
                    toolbarButtons={[
                        <IconButton className="lightbox-close" icon={ iconClose } onClick={ this.handleLightboxClose } />
                    ]}
                /> }
            </article>
        );
    }

    renderFooter() {
        const { activePanelIndex, totalPanelCount } = this.props;

        // Don't show a footer unless there's items to switch
        if (totalPanelCount < 2) {
            return null;
        }

        return (
            <footer>
                <ReactSVG onClick={ () => this.handlePanelChange(-1) } className="arrow arrow--left" src={ iconArrow } />
                <span>{ activePanelIndex + 1 } of { totalPanelCount }</span>
                <ReactSVG onClick={ () => this.handlePanelChange(1) } className="arrow arrow--right" src={ iconArrow } />
            </footer>
        );
    }
}

const isFirst = (props) => {
    return props.activePanelIndex < 1;
};

const isLast = (props) => {
    return props.activePanelIndex >= props.totalPanelCount - 1;
};

const StyledInfoPanel = styled(InfoPanel)`
    background: ${props => props.theme.colourForeground};
    border-radius: 1.2rem;
    color: ${props => props.theme.textBody};
    width: 100%;

    ${Media.tablet`
        bottom: 10rem;
        right: 3rem;
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    `}

    ul {
        padding: 0 0 0 2rem;

        li {
            margin: 0 0 0.5rem 0;
        }
    }

    article {
        padding: 2rem;

        img {
            cursor: pointer;
            display: block;
            margin: 0 auto;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        &.panel-link {
            height: auto;
        }

        a {
            &:after {
                background: url(${require('@svg/icon-link.svg')}) no-repeat 50% 50%;
                background-size: contain;
                content: '';
                display: inline-block;
                height: 1rem;
                margin: 0 0 0 0.2rem;
                position: relative;
                top: -0.2rem;
                width: 1rem;
            }
        }
    }

    footer {
        border-top: 0.1rem solid ${props => props.theme.colourForegroundHover};
        height: 5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
            user-select: none;
        }
    }

    .arrow {
        display: block;
        line-height: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
            display: flex;
            padding: 0 2rem;
        }

        svg {
            width: 1.6rem;
            height: 1.6rem;
            fill: ${props => props.theme.colourInactive};
            transform: rotate(90deg);
        }

        &--left {
            opacity: ${props => isFirst(props) ? 0.5 : 1 };
            cursor: ${props => isFirst(props) ? 'default' : 'pointer'};

            &:hover {
                svg {
                    fill: ${props => isFirst(props) ? props.theme.colourInactive : props.theme.colourPrimary};
                }
            }
        }

        &--right {
            opacity: ${props => isLast(props) ? 0.5 : 1 };
            cursor: ${props => isLast(props) ? 'default' : 'pointer'};

            svg {
                transform: rotate(270deg);
            }

            &:hover {
                svg {
                    fill: ${props => isLast(props) ? props.theme.colourInactive : props.theme.colourPrimary};
                }
            }
        }
    }

    /* Enter/Exit animation */
    &.panel-enter {
        opacity: 0;

        ${Media.tablet`
            transform: translateY(1rem);
        `}
    }

    &.panel-enter-done,
    &.panel-enter-active {
        opacity: 1;

        ${Media.tablet`
            transform: translateY(0rem);
        `}
    }

    &.panel-exit {
        opacity: 1;

        ${Media.tablet`
            transform: translateY(0rem);
        `}
    }

    &.panel-exit-done,
    &.panel-exit-active {
        opacity: 0;

        ${Media.tablet`
            transform: translateY(1rem);
        `}
    }
`;

const FooterInfoPanel = styled(StyledInfoPanel)`
    border-radius: 0;
    bottom: 0;
    height: 40vh;
    left: 0;
    position: fixed;
    right: 0;
    width: auto;
    z-index: 2;

    ${Media.tablet`
        border-radius: ${props => props.theme.radius};
        bottom: 10rem;
        height: auto;
        left: auto;
        position: absolute;
        left: 3rem;
        width: 35rem;
    `}
    
    &:after {
        border-left: 0.7rem solid transparent;
        border-right: 0.7rem solid transparent;
        border-bottom: 0.7rem solid ${props => props.theme.colourForeground};
        content: '';
        display: block;
        height: 0;
        position: absolute;
        left: 8rem;
        top: -0.7rem;
        width: 0;

        ${Media.tablet`
            top: auto;
            bottom: -0.7rem;  
            right: 14.8rem;
            transform: rotate(180deg);
        `}
    }

    .arrow {
        svg {
            transform: rotate(0);
        }

        &--right {
            svg {
                transform: rotate(180deg);
            }
        }
    }

    article {
        max-height: 30rem;

        img {
            height: 30rem;
        }
    }

    footer {
        bottom: 0;
        box-shadow: ${props => props.theme.colourForeground} 0 -1rem 2rem 0;
        left: 0;
        position: absolute;
        right: 0;

        ${Media.tablet`
            box-shadow: none;    
            position: relative;
        `}
    }
`;

export {
    StyledInfoPanel as InfoPanel,
    FooterInfoPanel
};
