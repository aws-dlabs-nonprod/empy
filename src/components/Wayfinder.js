import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { CSSTransition } from 'react-transition-group';
import Media from '@style/media';
import * as ActionTypes from '@constants/ActionTypes';

class Wayfinder extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.handleChoosePrompt = this.handleChoosePrompt.bind(this);
    }

    handleChoosePrompt(message) {
        this.context.sendMessage(message);

        this.props.hideWayfinder();
    }

    render() {
        const { wayfinders, isOpen } = this.props;

        return (
            <CSSTransition in={ isOpen } timeout={ 300 } unmountOnExit classNames="wayfinder">
                <StyledWayfinder { ...this.props }>
                    <span>You can ask me about</span>

                    { wayfinders.map((item, index) => (
                        <a key={ index } onClick={ () => this.handleChoosePrompt(item) }>
                            { item }
                        </a>
                    ))}
                </StyledWayfinder>
            </CSSTransition>
        );
    }
}

const StyledWayfinder = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 7.8rem;
    padding: 1.5rem;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 1;

    span {
        display: block;
        color: ${props => props.theme.textDark};
        font-size: 1.6rem;
        margin: 0 0 2rem 0;
    }

    a {
        font-size: 2.4rem;
        color: ${props => props.theme.textDark};
        display: block;
        font-family: 'ChronicleDisplay', serif;
        margin: 0 0 2rem 0;
        opacity: 0;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out, color 0.3s ease-in-out;
        transform: translateX(-2rem);

        &:nth-child(2) {
            transition-delay: 0.5s;
        }

        &:nth-child(3) {
            transition-delay: 1s;
        }

        &:nth-child(4) {
            transition-delay: 1.5s;
        }

        &:nth-child(5) {
            transition-delay: 2.0s;
        }

        &:nth-child(6) {
            transition-delay: 2.5s;
        }

        ${Media.tablet`
            &:hover {
                color: #a37a93;
            }
        `}
    }

    ${Media.tablet`
        width: 34rem;
        left: auto;
        right: 6rem;
        top: 15rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0;

        a {
            font-size: 4.2rem;
            line-height: 4.8rem;
        }
    `}

    /* Enter/Exit animation */
    &.wayfinder-enter {
        opacity: 0;

        a {
            opacity: 0;
            transform: translateX(-2rem);
        }
    }

    &.wayfinder-enter-done,
    &.wayfinder-enter-active {
        opacity: 1;

        a {
            opacity: 1;
            transform: translateX(0rem);
        }
    }

    &.wayfinder-enter-done {
        a {
            transition-delay: 0s;
        }
    }

    &.wayfinder-exit {
        opacity: 1;

        a {
            opacity: 1;
            transform: translateX(0rem);
        }
    }

    &.wayfinder-exit-done,
    &.wayfinder-exit-active {
        opacity: 0;

        a {
            opacity: 0;
            transform: translateX(-2rem);
        }
    }
`;


function mapStateToProps(state) {
    return {
        isOpen: state.showWayfinders && state.isConnected && !state.isTranscriptOpen,
        wayfinders: state.wayfinders
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideWayfinder: () => dispatch({
            type: ActionTypes.HIDE_WAYFINDER
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Wayfinder);
