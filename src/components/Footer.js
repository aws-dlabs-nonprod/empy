import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import * as ActionTypes from '@constants/ActionTypes';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { CSSTransition } from 'react-transition-group';

import { IconButton } from '@components/Button';
import { Indicator, StyledIndicator } from '@components/Indicator';
import { ChatInput, StyledChatInput } from '@components/Transcript/ChatInput';
import Tip from '@components/ButtonTip';

const iconChat = require('@svg/icon-chat.svg');
const iconInfo = require('@svg/icon-info.svg');
const iconClose = require('@svg/icon-close.svg');
const iconMic = require('@svg/icon-mic.svg');
const iconMicMute = require('@svg/icon-mic-mute.svg');

class Footer extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.handleToggleTranscript = this.handleToggleTranscript.bind(this);
        this.handleToggleMute = this.handleToggleMute.bind(this);
        this.handleShowFeedback = this.handleShowFeedback.bind(this);
        this.handleToggleInfoPanel = this.handleToggleInfoPanel.bind(this);
    }

    handleToggleInfoPanel() {
        this.props.toggleInfoPanel();
    }

    handleToggleTranscript() {
        const { isTranscriptOpen } = this.props;

        this.props.toggleTranscript(!isTranscriptOpen);

        setTimeout(() => {
            this.props.toggleShrinkPersona(!isTranscriptOpen);
        }, 800);
    }

    handleToggleMute() {
        this.props.toggleMute();
    }

    handleShowFeedback() {
        this.props.showFeedback();
    }

    getTranscriptHint() {
        const {
            isMuted,
            hasSeenMicrophonePrompt,
            hasSeenDontUnderstandPrompt,
            isNotUnderstanding,
            isTranscriptOpen
        } = this.props;

        if (isMuted && !hasSeenMicrophonePrompt && !isTranscriptOpen) {
            return 'Try sending Wendy a message';
        }

        if (isNotUnderstanding && !hasSeenDontUnderstandPrompt && !isTranscriptOpen) {
            return 'Try chatting with Wendy instead';
        }

        return '';
    }

    render() {
        const {
            isTranscriptOpen,
            isMuted,
            isConnected,
            personaState,
            isInfoPanelOpen,
            infoPanels
        } = this.props;

        const transcriptHint = this.getTranscriptHint();

        return (
            <CSSTransition
                in={ isConnected }
                timeout={ 300 }
                unmountOnExit
                classNames="footer"
            >

                <StyledFooter { ...this.props }>
                    <div className="button-group">
                        <CSSTransition in={ transcriptHint.length > 0 } timeout={ 300 } unmountOnExit classNames="hint">
                            <Tip className="hint">
                                <p>{ transcriptHint }</p>
                            </Tip>
                        </CSSTransition>

                        <IconButton icon={ iconChat }
                            tip={ !transcriptHint && 'Show chat transcript' || '' }
                            toggleTip="Hide chat transcript"
                            isToggled={ isTranscriptOpen }
                            onClick={ this.handleToggleTranscript }
                        />

                        <ChatInput />

                        <CSSTransition in={ !isTranscriptOpen && infoPanels.length > 0 } timeout={ 300 } unmountOnExit classNames="info">
                            <IconButton
                                className="info"
                                icon={ iconInfo }
                                tip="Show information"
                                tipPosition="center"
                                tipHidden={ isInfoPanelOpen }
                                onClick={ this.handleToggleInfoPanel }
                                isToggled={ isInfoPanelOpen }
                            />
                        </CSSTransition>
                    </div>

                    <Indicator personaState={ personaState } />

                    <div className="button-group">
                        <IconButton
                            icon={ iconMic }
                            toggleIcon={ iconMicMute }
                            tip="Mute your microphone"
                            toggleTip="Unmute your microphone"
                            tipPosition="center"
                            onClick={ this.handleToggleMute }
                            isToggled={ isMuted }
                        />
                        <IconButton
                            icon={ iconClose }
                            tipPosition="right"
                            tip="End the session"
                            onClick={ this.handleShowFeedback }
                        />
                    </div>
                </StyledFooter>
            </CSSTransition>
        );
    }
}

const StyledFooter = styled.footer`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1.5rem;
    position: absolute;
    bottom: ${props => props.isTranscriptOpen ? '-7.8rem' : 0};
    right: 0;
    left: 0;
    transition: all 0.3s ease-in-out;
    transition-property: bottom, transform, opacity;
    transform-origin: 0% 0%;
    transition-delay: ${props => props.isTranscriptOpen ? 0 : '0.5s'};
    z-index: 3;

    ${Media.desktop`
        padding: 3rem;
        bottom: 0;
    `}
    
    ${IconButton} {
        margin: 0 1rem 0 0;
        width: 4.8rem;

        ${Media.desktop`
            margin-right: 1.5rem;
        `}

        &:last-child {
            margin-right: 0;
        }
    }

    ${StyledIndicator} {
        margin-right: 1rem;
    
        ${Media.desktop`
            margin: 0 auto;
        `}
    }

    ${StyledChatInput} {
        display: none;

        ${Media.desktop`
            display: flex;
        `}
    }

    .button-group {
        display: flex;
        flex-direction: row;
    }

    .hint {
        bottom: 7.8rem;
        left: 1.5rem;
        opacity: 1;
        transform: translateY(0);

        &:after {
            left: 1.8rem;
        }

        &-enter {
            opacity: 0;
            transform: translateY(2rem);
        }

        &-enter-done,
        &-enter-active {
            opacity: 1;
            transform: translateY(0);
        }

        &-exit {
            opacity: 1;
            transition-duration: 0s, 0s;
        }

        &-exit-done,
        &-exit-active {
            opacity: 0;
        }

        ${Media.desktop`
            bottom: 9.3rem;
            left: 3rem;
        `};
    }

    .info {
        display: none;

        ${Media.desktop`
            display: flex;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
            position: absolute;
            left: 9.3rem;

            &-enter {
                opacity: 0;
            }

            &-enter-done,
            &-enter-active {
                opacity: 1;
            }

            &-exit {
                opacity: 1;
            }

            &-exit-done,
            &-exit-active {
                opacity: 0;
            }
        `}
    }

    /* Enter/Exit animation */
    &.footer-enter {
        opacity: 0;
        transform: translateY(2rem);
    }

    &.footer-enter-done,
    &.footer-enter-active {
        opacity: 1;
        transform: translateY(0);
    }

    &.footer-exit {
        opacity: 1;
        transform: translateY(0);
    }

    &.footer-exit-done,
    &.footer-exit-active {
        opacity: 0;
        transform: translateY(2rem);
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        isMuted: state.isMuted,
        personaState: state.personaState,
        isInfoPanelOpen: state.isInfoPanelOpen,
        infoPanels: state.infoPanels,
        hasSeenMicrophonePrompt: state.hasSeenMicrophonePrompt,
        hasSeenDontUnderstandPrompt: state.hasSeenDontUnderstandPrompt,
        isNotUnderstanding: state.isNotUnderstanding
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleTranscript: (isToggled) => dispatch({
            type: ActionTypes.TRANSCRIPT_TOGGLE,
            isToggled
        }),

        toggleMute: () => dispatch({
            type: ActionTypes.TOGGLE_MUTE
        }),

        toggleInfoPanel: () => dispatch({
            type: ActionTypes.TOGGLE_INFO_PANEL
        }),

        toggleShrinkPersona: (isToggled) => dispatch({
            type: ActionTypes.TOGGLE_PERSONA_SHRINK,
            isToggled
        }),

        showFeedback: () => dispatch({
            type: ActionTypes.SHOW_FEEDBACK
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);
