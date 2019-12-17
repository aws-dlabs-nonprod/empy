import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';
import Media from '@style/media';

import Button, { SecondaryButton, SecondaryButtonSmall } from '@components/Button';
import Loader from '@components/Loader';
import { SoulMachinesContext } from '@contexts/SoulMachines';

class InfoPanel extends Component {

    static contextType = SoulMachinesContext;

    constructor(props, context) {
        super(props, context);

        this.state = {
            isVideoStarted: false,
            isAudioStarted: false
        };

        this.handleVideoStart = this.handleVideoStart.bind(this);
        this.handleAudioStart = this.handleAudioStart.bind(this);
    }

    handleVideoStart() {
        this.props.startLoading();

        this.setState({ isVideoStarted: true });
        
        this.context.createScene(false)
            .then(() => {
                this.props.startVideo();
            });
    }

    handleAudioStart() {
        this.props.startLoading();

        this.setState({ isAudioStarted: true });

        this.context.createScene(true)
            .then(() => {
                this.props.startAudio();
            });
    }

    render() {
        const { hasCamera, hasMicrophone, isLoading, isBrowserSupported, allowAudioOnly } = this.props;
        const { isVideoStarted, isAudioStarted } = this.state;

        if (!isBrowserSupported) {
            return this.renderUnsupportedMessage();
        }

        return (
            <StyledInfoPanel>
                <div className="content">
                    <h1>Hi! I'm Wendy</h1>
                    
                    <p>If you turn on your camera and microphone I can see and hear you.</p>
                    <p>I find it easier to hear and focus on you if you are in a quiet space without too much background noise.</p>
                    <p>Ask me a question and I’ll do my best to answer it. I’m still learning so may not be able to answer all your questions.</p>
                    <p>Please don't tell me your personal details — I can’t give you any information relating to your personal banking or give you financial advice.</p>

                    <div className="actions">
                        { hasCamera && hasMicrophone &&
                            <Fragment>
                                <Button disabled={ isLoading } onClick={ this.handleVideoStart }>
                                    { isLoading && isVideoStarted ? <Loader /> : 'Start a video chat' }
                                </Button>
                                { allowAudioOnly &&
                                <SecondaryButton disabled={ isLoading } onClick={ this.handleAudioStart }>
                                    { isLoading && isAudioStarted ? <Loader /> : 'Start a voice chat' }
                                </SecondaryButton>
                                }
                            </Fragment>
                        }

                        { !hasCamera && hasMicrophone && allowAudioOnly &&
                            <Button disabled={ isLoading } onClick={ this.handleAudioStart }>
                                { isLoading ? <Loader /> : 'Start a voice chat' }
                            </Button>
                        }

                        {/*
                        Safari doesn't support webrtc video streams if you've not given webcam permissions
                        https://stackoverflow.com/a/53914556
                        */}
                        { ((!hasCamera && !hasMicrophone) || (!hasCamera && !allowAudioOnly)) &&
                            <p>It looks like you don't have a camera or microphone connected. Please connect one and try again.</p>
                        }

                    </div>
                </div>

                <SecondaryButtonSmall href="https://www.westpac.com.au/privacy/full-privacy-policy/" target="_blank">View privacy statement</SecondaryButtonSmall>
            </StyledInfoPanel>
        );
    }

    renderUnsupportedMessage() {
        return (
            <StyledInfoPanel>
                <div className="content">
                    <h1>Sorry</h1>
                    
                    <p>It looks like the browser or device you're using is not supported.</p>
                    <p>Wendy requires the latest version of Chrome, Firefox, Edge, or Safari on a desktop computer.</p>
                    <p>For mobile devices please use Apple iOS 11 or greater with Safari, or Android 4.4 or greater with Chrome or Firefox.</p>
                </div>
            </StyledInfoPanel>
        );
    }
}

const StyledInfoPanel = styled.div`
    align-items: flex-start;
    box-sizing: border-box;
    display: flex;
    padding: 7rem 0 0 0;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 3;
    overflow: auto;

    ${Media.tablet`
        font-size: 1.4rem;
        padding: 11rem 0 4rem 0;
    `}

    ${Media.intro`
        align-items: center;
        padding: 0;
    `}

    .actions {
        background: ${props => props.theme.colourBackground};
        border-top: 0.1rem solid ${props => props.theme.colourDivider};
        bottom: 0;
        left: 0;
        padding: 1.5rem 1.5rem 6rem 1.5rem;
        position: fixed;
        right: 0;
        z-index: 2;

        >:last-child {
            margin-bottom: 0;
        }

        ${Media.tablet`
            background: none;
            position: relative;
            padding: 3rem 0 0 0;
            margin: 0;

            ${SecondaryButtonSmall} {
                display: none;
            }
        `}
    }

    .content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        margin: 0 1.5rem;
        padding: 0 0 13rem 0;

        ${Media.tablet`
            flex-basis: calc(41.6666666667% - 4.5rem);
            margin-left: calc(100% / 12 + 3rem);
            margin-right: 0;
            padding: 0;
        `}

        ${Media.desktop`
            flex-basis: calc(33.3333333333% - 4rem);
        `}

        ${Media.large`
            flex-basis: calc(25% - 4rem);
        `}
    }

    p:last-of-type {
        margin-bottom: 3rem;
    }

    ${SecondaryButtonSmall} {
        position: fixed;
        left: 1.5rem;
        bottom: 1.5rem;
        max-width: 20rem;
        margin: 0;

        ${Media.desktop`
            position: absolute;
        `}
    }
`;

function mapStateToProps(state) {
    return {
        hasCamera: state.hasCamera,
        hasMicrophone: state.hasMicrophone,
        isLoading: state.isLoading,
        isBrowserSupported: state.isBrowserSupported,
        allowAudioOnly: state.allowAudioOnly
    };
}

function mapDispatchToProps(dispatch) {
    return {
        startLoading: () => dispatch({
            type: ActionTypes.START_LOADING
        }),

        startVideo: () => dispatch({
            type: ActionTypes.SCENE_START_VIDEO
        }),

        startAudio: () => dispatch({
            type: ActionTypes.SCENE_START_AUDIO
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoPanel);

