import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';

class Feedback extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <StyledFeedback {...this.props}>
                <div className="feedback"></div>
            </StyledFeedback>
        );
    }
}

const StyledFeedback = styled.div`
    bottom:0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;

    pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
    opacity: ${props => props.isVisible ? 1 : 0};
    transition: opacity 0.3s ease-in-out;

    .feedback {
        bottom:0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }
`;

function mapStateToProps(state) {
    return {
        isFinished: state.isFinished,
        isConnected: state.isConnected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        feedbackSubmit: () => dispatch({
            type: ActionTypes.FEEDBACK_SUBMIT
        }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Feedback);
