import React, { Component } from 'react';
import styled from 'styled-components';
import Media from '@style/media';
import { connect } from 'react-redux';
import * as ActionTypes from '@constants/ActionTypes';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import svgSprite from '@style/svg';
import CameraPreview from '@components/CameraPreview';

const logo = require('@svg/logo.svg');

class Header extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();


        this.handleGoHome = this.handleGoHome.bind(this);
    }

    handleGoHome() {
        const { isConnected } = this.props;

        if (isConnected) {
            this.props.showFeedback();
        } else {
            this.props.goHome();
        }
    }

    render() {
        const {
            isConnected,
            isTranscriptOpen,
            isMuted,
            hasCamera,
            hasMicrophone,
            isVideoCollapsed,
            isUserSpeaking
        } = this.props;

        return (
            <StyledHeader { ...this.props }>
                <div className="logo">
                    <div className="logo__image"
                        onClick={ this.handleGoHome }
                        dangerouslySetInnerHTML={{ __html: svgSprite(logo)}}>
                    </div>
                </div>
    
                { isConnected &&
                    <CameraPreview
                        isMuted={ isMuted }
                        hasCamera={ hasCamera }
                        hasMicrophone={ hasMicrophone }
                        isTranscriptOpen={ isTranscriptOpen }
                        isVideoCollapsed={ isVideoCollapsed }
                        isUserSpeaking={ isUserSpeaking }
                        toggleVideoCollapse={() => {
                            this.props.toggleVideoCollapse();
                        }}
                    />
                }
            </StyledHeader>
        );
    }
}

const StyledHeader = styled.header`
    left: 0%;
    padding: 1.5rem;
    position: fixed;
    right: 0;
    top: 0;
    height: 4.8rem;
    transform: translate3d(0, 0, 0);
    z-index: 4;

    ${Media.desktop`
        padding: 3rem;
        background: none;
        border: none;
        height: auto;
    `}

    .logo {
        display: flex;
        align-items: center;
    }

    .logo__image {
        cursor: pointer;
        width: 5.2rem;
        height: 2.1rem;
        margin: 0.7rem 1.5rem 0.7rem 0;

        ${Media.desktop`
            width: 6.9rem;
            height: 2.8rem;
            margin: 0 2rem 0 0;

            svg {
                width: 6.9rem;
                height: 2.8rem;
            }
        `}

        svg {
            display: block;
            width: 100%;
        }
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        isMuted: state.isMuted,
        hasCamera: state.hasCamera && state.isVideoEnabled,
        hasMicrophone: state.hasMicrophone,
        isVideoCollapsed: state.isVideoCollapsed,
        isUserSpeaking: state.isUserSpeaking
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleVideoCollapse: () => dispatch({
            type: ActionTypes.TOGGLE_VIDEO_COLLAPSE
        }),

        goHome: () => dispatch({
            type: ActionTypes.SCENE_DISCONNECTED
        }),

        showFeedback: () => dispatch({
            type: ActionTypes.SHOW_FEEDBACK
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
