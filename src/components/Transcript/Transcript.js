import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SimpleBar from 'simplebar-react';
import * as ActionTypes from '@constants/ActionTypes';
import SimpleBarCSS from '@style/simplebar';
import animateScrollTo from 'animated-scroll-to';

import TranscriptMessage from '@components/Transcript/TranscriptMessage';
import { ChatInput, StyledChatInput } from '@components/Transcript/ChatInput';
import { IconButton } from '@components/Button';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { Indicator, StyledIndicator } from '@components/Indicator';

const iconClose = require('@svg/icon-close.svg');
const iconMic = require('@svg/icon-mic.svg');
const iconMicMute = require('@svg/icon-mic-mute.svg');

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
        this.handleToggleMute = this.handleToggleMute.bind(this);
    }

    bindScrollRef(instance) {
        if (instance) {
            this.scrollRef = instance;
        }
    }

    handleToggleMute() {
        this.props.toggleMute();
    }

    handleToggleTranscript() {
        const { isOpen } = this.props;

        this.props.toggleShrinkPersona(!isOpen);

        setTimeout(() => {
            this.props.toggleTranscript(!isOpen);
        }, 200);
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
        const { eventBus } = this.context;

        // Transcript toggled
        if (prevProps.isOpen !== isOpen) {
            if (isOpen) {
                eventBus.emit('scroll:bottom');
            }
        }
    }

    render() {
        const { isConnected, isOpen, isMuted, personaState } = this.props;

        return (
            <CSSTransition in={ isOpen && isConnected } timeout={ 1000 } unmountOnExit classNames="transcript">
                <StyledTranscript ref={ this.transcriptRef } { ...this.props }>
                    <IconButton
                        isToggled={ true }
                        className="close"
                        icon={ iconClose }
                        onClick={ this.handleToggleTranscript }
                    />

                    <IconButton
                        className="mute"
                        icon={ iconMic }
                        toggleIcon={ iconMicMute }
                        tipPosition="center"
                        onClick={ this.handleToggleMute }
                        isToggled={ isMuted }
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
    border-top: 0.1rem solid ${props => props.theme.colourDivider};
    bottom: 0;
    height: ${props => props.theme.splitHeight};
    left: 0;
    opacity: 0;
    position: absolute;
    top: auto;
    transform: translateY(130%);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    width: 100%;
    z-index: 2;

    ${Media.desktop`
        transition-duration: 0.5s, 0s;
        background: transparent;
        border: none;
        bottom: 10rem;
        left: 3rem;
        top: 11rem;
        width: 43.3rem;
        height: auto;
    `}

    ${StyledChatInput} {
        opacity: 0;
        transform: translateY(2rem);
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

        ${Media.desktop`
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

        ${Media.desktop`
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

        ${Media.desktop`
            display: none;
        `}
    }
    
    /* Mute toggle button */
    .mute {
        position: absolute;
        right: 1.5rem;
        top: -6.4rem;
        width: 4.8rem;
        height: 4.8rem;
        padding: 1.3rem;
        margin: 0;

        ${Media.desktop`
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

        ${Media.desktop`
            display: block;
            top: 0;
            width: 43.3rem;
            left: 0;
        `}
    }
    
    &:after {
        bottom: 7.7rem;
        top: auto;

        ${Media.desktop`
            bottom: 0;
            left: 0;
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

        ${Media.desktop`
            width: 100%;
            height: calc(100% - 1rem);
            padding: 0;
        `}
    }

    .transcript-content {
        padding: 1.5rem 0 0 1.5rem;

        ${Media.desktop`
            padding: 3rem 2rem 0 0;
        `}
    }
    
    /* Enter/Exit animation */
    &.transcript-enter {
        opacity: 0;
        transform: translateY(130%);

        ${StyledChatInput} {
            opacity: 0;
            transform: translateY(2rem);
        }

        ${Media.desktop`
            transform: translateY(0);
        `}
    }

    &.transcript-enter-done,
    &.transcript-enter-active {
        opacity: 1;
        transform: translateY(0);

        ${StyledChatInput} {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0.5s;
        }

        ${Media.desktop`
            transform: translateY(0);
        `}
    }

    &.transcript-exit {
        opacity: 1;
        transform: translateY(0);

        ${StyledChatInput} {
            opacity: 1;
            transform: translateY(0);
        }

        ${Media.desktop`
            transform: translateY(0);
        `}
    }

    &.transcript-exit-done,
    &.transcript-exit-active {
        opacity: 0;
        transform: translateY(130%);

        ${StyledChatInput} {
            opacity: 0;
            transform: translateY(2rem);
        }

        ${Media.desktop`
            transform: translateY(0);
        `}
    }

    ${SimpleBarCSS};
`;

function mapStateToProps(state) {
    return {
        isOpen: state.isTranscriptOpen,
        isMuted: state.isMuted,
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
            newIndex
        }),

        toggleTranscript: (isToggled) => dispatch({
            type: ActionTypes.TRANSCRIPT_TOGGLE,
            isToggled
        }),

        toggleShrinkPersona: (isToggled) => dispatch({
            type: ActionTypes.TOGGLE_PERSONA_SHRINK,
            isToggled
        }),

        toggleMute: () => dispatch({
            type: ActionTypes.TOGGLE_MUTE
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transcript);
