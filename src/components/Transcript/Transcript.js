import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SimpleBar from 'simplebar-react';
import * as ActionTypes from '@constants/ActionTypes';
import { CameraPosition } from '@utils/camera';
import SimpleBarCSS from '@style/simplebar';
import animateScrollTo from 'animated-scroll-to';

import TranscriptMessage from '@components/Transcript/TranscriptMessage';
import { ChatInput, StyledChatInput } from '@components/Transcript/ChatInput';
import { IconButton } from '@components/Button';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { Indicator, StyledIndicator } from '@components/Indicator';

const iconClose = require('@svg/icon-close.svg');

class Transcript extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.scrollRef = null;
        this.transcriptRef = React.createRef();
        this.contentRef = React.createRef();

        this.handleScroll = this.handleScroll.bind(this);
        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
        this.handleToggleTranscript = this.handleToggleTranscript.bind(this);
    }

    bindScrollRef(instance) {
        if (instance) {
            this.scrollRef = instance;
        }
    }

    handleToggleTranscript() {
        this.props.toggleTranscript();
    }

    handleScroll() {
        const { scrollTop, scrollHeight, offsetHeight } = this.scrollRef;
        const { offsetHeight: contentHeight } = this.contentRef.current;
        const { current: transcript } = this.transcriptRef;

        const hasOverflowTop = scrollTop > 0 && contentHeight > offsetHeight;
        const hasOverflowBottom = (scrollHeight - scrollTop) >= offsetHeight + 15;

        /*
         * This isn't ideal, but if we set a state for it then performance will
         * dive as we trigger a React render every scroll step
         */
        transcript.classList.toggle('overflow-top', hasOverflowTop);
        transcript.classList.toggle('overflow-bottom', hasOverflowBottom);
    }

    handlePanelChange(direction, messageIndex, panel) {
        const { infoPanels } = this.props;

        if (!this.scrollRef) {
            return;
        }

        let targetPanelIndex = panel.index + direction;

        targetPanelIndex = Math.max(targetPanelIndex, 0);
        targetPanelIndex = Math.min(targetPanelIndex, infoPanels.length - 1);

        if (panel.index === targetPanelIndex) {
            return;
        }

        this.scrollToPanel(targetPanelIndex);
    }

    handleScrollToBottom() {
        this.scrollToBottom();
    }

    scrollToPanel(panelIndex) {
        const { transcript } = this.props;

        for (let i = 0; i < transcript.length; i++) {
            const { panel } = transcript[i];

            if (!panel) {
                continue;
            }

            if (panel.index === panelIndex) {
                const messageNode = document.querySelector(`#message-${i}`);

                // Position it in the middle of the transcript
                const targetScrollPosition = messageNode.offsetTop
                    - (this.scrollRef.clientHeight / 2)
                    + (messageNode.clientHeight / 2);

                this.scrollRef.scrollTo({
                    left: 0,
                    top: targetScrollPosition - 20,
                    behavior: 'smooth'
                });

                break;
            }
        }
    }

    scrollToBottom() {
        if (this.scrollRef) {
            animateScrollTo(this.scrollRef.scrollHeight, { element: this.scrollRef });
        }
    }

    componentDidMount() {
        const { eventBus } = this.context;

        eventBus.on('scroll:bottom', this.handleScrollToBottom);
    }

    componentDidUpdate(prevProps) {
        const { isOpen } = this.props;

        // Transcript toggled, move the avatar
        if (prevProps.isOpen !== isOpen) {
            this.props.animateCamera(
                isOpen ? CameraPosition.RIGHT : CameraPosition.CENTER
            );
        }
    }

    render() {
        const { isConnected, isOpen, personaState } = this.props;

        return (
            <CSSTransition in={ isOpen && isConnected } timeout={ 300 } unmountOnExit classNames="transcript">
                <StyledTranscript ref={ this.transcriptRef } { ...this.props }>
                    <IconButton
                        isToggled={ true }
                        className="close"
                        icon={ iconClose }
                        onClick={ this.handleToggleTranscript }
                    />

                    <Indicator personaState={ personaState } />

                    <SimpleBar onScroll={ this.handleScroll }
                        scrollableNodeProps={{ ref: (instance) => this.bindScrollRef(instance) }}
                        style={{ overflowX: 'hidden' }}>
                        { this.renderItems() }
                    </SimpleBar>

                    <ChatInput />
                </StyledTranscript>
            </CSSTransition>
        );
    }

    renderItems() {
        const { transcript, infoPanels, activePanelIndex } = this.props;

        return (
            <div ref={ this.contentRef }>
                <TransitionGroup className="transcript-content">
                    { transcript.map((message, index) =>
                        <CSSTransition key={ index } timeout={ 1000 } classNames="item">
                            <TranscriptMessage
                                key={ `message-${index}`}
                                id={ `message-${index}`}
                                { ...message }
                                activePanelIndex={ activePanelIndex }
                                totalPanelCount={ infoPanels.length }
                                onContentResize={ () => {
                                    this.scrollToBottom();
                                }}
                                onPanelChange={ (direction) => {
                                    this.handlePanelChange(direction, index, message.panel);
                                }}
                            />
                        </CSSTransition>
                    ) }
                </TransitionGroup>
            </div>
        );
    }
};

const StyledTranscript = styled.div`
    background: ${props => props.theme.colourBackground};
    bottom: 0;
    left: 0;
    position: absolute;
    top: auto;
    height: ${props => props.isOpen ? props.theme.splitHeight : '0vh'};
    width: 100%;
    transition: opacity 1s ease-in-out;
    z-index: 2;
    border-top: 0.1rem solid ${props => props.theme.colourDivider};

    ${Media.tablet`
        background: transparent;
        border: none;
        bottom: 10rem;
        left: 3rem;
        top: 11rem;
        width: 43.3rem;
        height: auto;
    `}

    ${StyledChatInput} {
        ${Media.tablet`
            display: none;
        `}
    }

    ${StyledIndicator} {
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        top: -6.4rem;
        height: 4.8rem;

        ${Media.tablet`
            display: none;
        `}
    }

    /* Transcript close button */
    .close {
        position: absolute;
        left: 1.5rem;
        top: -6.4rem;
        width: 4.8rem;
        height: 4.8rem;
        padding: 1.3rem;
        margin: 0;

        ${Media.tablet`
            display: none;
        `}
    }

    &:after,
    &:before {
        background: ${props => props.theme.colourDivider};
        content: '';
        height: 0.1rem;
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        right: 0;
        top: 0;
        transition: opacity 0.2s ease-in-out, height 0.2s ease-in-out;
        z-index: 2;
    }

    &:before {
        display: none;

        ${Media.tablet`
            display: block;
            top: 11rem;
            width: 43.3rem;
            left: 3rem;
        `}
    }
    
    &:after {
        bottom: 7.7rem;
        top: auto;

        ${Media.tablet`
            bottom: 10rem;
            left: 3rem;
            width: 43.3rem;
        `}
    }

    &.overflow-top:before {
        opacity: 1;
    }

    &.overflow-bottom:after {
        opacity: 1;
    }
    
    .scroller {
        width: calc(100% - 3rem);
        height: calc(100% - 6rem);
        overflow: auto;
        padding: 0 1.5rem;
        position: absolute;

        ${Media.tablet`
            width: 100%;
            height: calc(100% - 1rem);
            padding: 0;
        `}
    }

    .transcript-content {
        padding: 1.5rem 0 0 1.5rem;

        ${Media.tablet`
            padding: 3rem 2rem 0 0;
        `}
    }
    
    /* Enter/Exit animation */
    &.transcript-enter {
        opacity: 0;
    }

    &.transcript-enter-done,
    &.transcript-enter-active {
        opacity: 1;
    }

    &.transcript-exit {
        opacity: 1;
    }

    &.transcript-exit-done,
    &.transcript-exit-active {
        opacity: 0;
    }

    ${SimpleBarCSS};
`;

function mapStateToProps(state) {
    return {
        isOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        transcript: state.transcript,
        infoPanels: state.infoPanels,
        activePanelIndex: state.activePanelIndex,
        personaState: state.personaState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePanel: (newIndex) => dispatch({
            type: ActionTypes.CHANGE_PANEL,
            newIndex: newIndex
        }),

        animateCamera: (position) => dispatch({
            type: ActionTypes.ANIMATE_CAMERA,
            camera: position
        }),

        toggleTranscript: () => dispatch({
            type: ActionTypes.TRANSCRIPT_TOGGLE
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transcript);
