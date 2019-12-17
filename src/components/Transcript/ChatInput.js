import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import * as ActionTypes from '@constants/ActionTypes';
import { CSSTransition } from 'react-transition-group';
import { IconButton } from '@components/Button';
import { SoulMachinesContext } from '@contexts/SoulMachines';

const iconSend = require('@svg/icon-send.svg');

class ChatInput extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.state = {
            message: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const { isOpen } = this.props;

        // Focus the input field when we open
        if (prevProps.isOpen !== isOpen && isOpen) {
            this.inputRef.current.focus();
        }
    }

    handleSubmit(event) {
        if (typeof event === 'object') {
            event.preventDefault();
        }

        const { message } = this.state;

        if (message) {
            this.context.sendMessage(message);
        }

        this.setState({
            message: ''
        });
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    render() {
        const { message } = this.state;
        const { isOpen } = this.props;

        return (
            <CSSTransition in={ isOpen } timeout={ 3000 } unmountOnExit classNames="form">
                <StyledChatInput method="post" action="/" onSubmit={ this.handleSubmit }>
                    <input ref={ this.inputRef } onChange={ this.handleChange } value={ message } placeholder="Type a message or just speak it..." />
                    <IconButton icon={ iconSend } onClick={ this.handleSubmit } />
                </StyledChatInput>
            </CSSTransition>
        );
    }
}

const StyledChatInput = styled.form`
    bottom: 1.5rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 4.8rem;
    left: 1.5rem;
    overflow: hidden;
    position: fixed;
    right: 1.5rem;
    transition: width 0.3s ease-in-out;
    transition-property: opacity, width, transform;
    width: auto;
    will-change: opacity, width;
    z-index: 3;

    ${Media.desktop`
        left: auto;
        position: relative;
        right: auto;
        bottom: auto;
        width: 37rem;
    `}

    input {
        box-sizing: border-box;
        display: block;
        width: 100%;
        background: ${props => props.theme.colourForeground};
        border: 0.1rem solid ${props => props.theme.colourFaintBorder};
        border-right: none;
        border-radius: ${props => props.theme.radius} 0 0 ${props => props.theme.radius};
        height: 4.8rem;
        padding: 0 1.2rem;
        color: ${props => props.theme.textPrimary};
        font-size: 1.6rem;
        outline: none;
        
        &::placeholder {
            color: rgba(0, 0, 0, 0.4);
        }
    }

    ${IconButton} {
        background: ${props => props.theme.colourPrimary};
        border: ${props => `0.1rem solid ${props.theme.colourPrimary}`};
        border-radius: 0 ${props => props.theme.radius} ${props => props.theme.radius} 0;
        width: auto;
        height: 4.8rem;

        ${Media.desktop`
            &:hover {
                background: ${props => props.theme.colourPrimaryHover};
            }
        `}

        svg {
            fill: ${props => props.theme.colourForeground};
        }
    }

    /* Enter/Exit animation */
    &.form-enter {
        opacity: 0;
        transform: translateY(2rem);

        ${Media.desktop`
            transform: none;
            width: 0;
        `}
    }

    &.form-enter-done,
    &.form-enter-active {
        opacity: 1;
        transform: translateY(0);

        ${Media.desktop`
            transform: none;
            width: 37rem;
        `}
    }

    &.form-exit {
        opacity: 1;
        transform: translateY(0);

        ${Media.desktop`
            transform: none;
            width: 37rem;
        `}
    }

    &.form-exit-done,
    &.form-exit-active {
        opacity: 0;
        transform: translateY(2rem);

        ${Media.desktop`
            transform: none;
            width: 0;
        `}
    }
`;

function mapStateToProps(state) {
    return {
        isOpen: state.isTranscriptOpen
    };
}

function mapDispatchToProps(dispatch) {
    return {
        sendMessage: (message) => dispatch({
            type: ActionTypes.TRANSCRIPT_SEND_MESSAGE,
            message: message
        })
    };
}

const ConnectedChatInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatInput);

export {
    ConnectedChatInput as ChatInput,
    StyledChatInput
};
