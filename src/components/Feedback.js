import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';
import Media from '@style/media';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { CSSTransition } from 'react-transition-group';
import Loader, { StyledLoader } from '@components/Loader';

class Feedback extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.frameRef = React.createRef();
        this.overlayRef = React.createRef();

        this.handlePostMessage = this.handlePostMessage.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(event) {
        const { current } = this.overlayRef;

        // Close the form if the user clicks outside (on the overlay)
        if (event.target === current) {
            this.props.hideFeedback();
        }
    }

    handlePostMessage(event) {
        const { isConnected } = this.props;

        switch (event.data) {
            case 'cancel': // Close feedback without submitting
            case 'close-iframe': // Submit feedback and end session
                this.props.hideFeedback();

                if (isConnected) {
                    this.context.disconnect();
                }
                break;
        }
    }

    componentDidMount() {
        window.addEventListener('message', this.handlePostMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePostMessage);
    }

    render() {
        const { isVisible } = this.props;

        return (
            <CSSTransition in={ isVisible } timeout={ 500 } unmountOnExit classNames="overlay">
                <StyledFeedback { ...this.props } ref={ this.overlayRef } onClick={ this.handleClose }>
                    <div className="feedback">
                        <Loader />
                        <iframe id="feedback-frame" ref={ this.frameRef } src={ FEEDBACK }></iframe>
                    </div>
                </StyledFeedback>
            </CSSTransition>
        );
    }
}

const StyledFeedback = styled.div`
    bottom:0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    background: rgba(229, 229, 229, 0.8);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.5s ease-in-out, backdrop-filter 0.5s ease-in-out;

    .feedback {
        left: 2rem;
        right: 2rem;
        top: 4rem;
        bottom: 4rem;
        position: absolute;
        background: #f4f3f0;
        border-radius: ${props => props.theme.radius};
        border: 0.2rem solid ${props => props.theme.colourDivider};
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        ${Media.tablet`
            left: auto;
            right: auto;
            top: auto;
            bottom: auto;
            width: 40rem;
            min-height: 60rem;
        `};
    }

    iframe {
        position: absolute;
        border: none;
        width: calc(100% - 4rem);
        height: calc(100% - 4rem);
        margin: 2rem;
        top: 0;
        left: 0;
    }

    ${StyledLoader} {
        circle {
            stroke: ${props => props.theme.colourPrimary};
        }
    }

    /* Enter/Exit animation */
    &.overlay-enter {
        opacity: 0;
        backdrop-filter: blur(0);
    }

    &.overlay-enter-done,
    &.overlay-enter-active {
        opacity: 1;
        backdrop-filter: blur(0.5rem);
    }

    &.overlay-exit {
        opacity: 1;
        backdrop-filter: blur(0.5rem);
    }

    &.overlay-exit-done,
    &.overlay-exit-active {
        opacity: 0;
        backdrop-filter: blur(0);
    }
`;

function mapStateToProps(state) {
    return {
        showFeedback: state.showFeedback,
        isConnected: state.isConnected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideFeedback: () => dispatch({
            type: ActionTypes.HIDE_FEEDBACK
        }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Feedback);
