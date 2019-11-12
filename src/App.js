import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SoulMachinesProvider } from '@contexts/SoulMachines';
import * as ActionTypes from '@constants/ActionTypes';
import { smwebsdk } from '@soulmachines/smwebsdk';

import GlobalStyle from '@style/global';
import theme from '@style/theme';

import Header from '@components/Header';
import Feedback from '@components/Feedback';
import Footer from '@components/Footer';
import PersonaVideo from '@components/PersonaVideo';
import IntroPanel from '@components/IntroPanel';
import Transcript from '@components/Transcript/Transcript';
import Container from '@components/Container';
import { FooterInfoPanel } from '@components/InfoPanel';
import IntroVideo from '@components/IntroVideo';
import Wayfinder from '@components/Wayfinder';

const PRELOAD = [
    require('@svg/icon-mic.svg'),
    require('@svg/icon-mic-mute.svg'),
    require('@svg/icon-collapse.svg'),
    require('@svg/icon-chat.svg'),
    require('@svg/icon-info.svg'),
    require('@svg/icon-close.svg'),
    require('@svg/icon-pause.svg'),
    require('@svg/icon-arrow.svg')
];

class App extends Component {

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
    }

    componentDidMount() {
        // Detect device capabilities
        smwebsdk.DetectCapabilities().then((result) => {
            const isSafari = navigator.userAgent.match(/Version\/[0-9.]+ Safari\/[0-9.]+/) !== null;

            this.props.setFeatures({
                hasCamera: result.hasCamera,
                hasMicrophone: result.hasMicrophone,
                isBrowserSupported: result.isBrowserSupported,
                isSafari: isSafari
            });
        });

        // Preload icons to prevent blank buttons during session start
        for (let i = 0; i < PRELOAD.length; i++) {
            const img = new Image();
            img.src = PRELOAD[i];
        }
    }

    handlePanelChange(direction) {
        this.props.changePanel(direction);
    }

    render() {
        return (
            <ThemeProvider theme={ theme }>
                <SoulMachinesProvider>
                    <GlobalStyle />

                    { this.renderContainer() }
                </SoulMachinesProvider>
            </ThemeProvider>
        );
    }

    renderContainer() {
        const {
            isConnected,
            isFinished,
            isInfoPanelOpen,
            infoPanels,
            activePanelIndex
        } = this.props;

        return (
            <Container isInfoPanelOpen={ isConnected && isInfoPanelOpen }>
                {/* { !isConnected && !isFinished && <IntroVideo /> } */}

                <PersonaVideo />

                <Header />

                { !isConnected /* && !isFinished */ && <IntroPanel /> }

                <Transcript />

                <Wayfinder />

                <Footer />

                {/* <Feedback isVisible={ !isConnected && isFinished } /> */}

                { isConnected && infoPanels.length > 0 && <FooterInfoPanel
                    panel={ infoPanels[activePanelIndex] }
                    activePanelIndex={ activePanelIndex }
                    totalPanelCount={ infoPanels.length }
                    onPanelChange={ this.handlePanelChange }
                    isOpen={ isInfoPanelOpen }
                /> }
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        isVideoEnabled: state.isVideoEnabled,
        isConnected: state.isConnected,
        isFinished: state.isFinished,
        isInfoPanelOpen: state.isInfoPanelOpen,
        infoPanels: state.infoPanels,
        activePanelIndex: state.activePanelIndex
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setFeatures: (features) => dispatch({
            type: ActionTypes.SET_FEATURES,
            features: features
        }),

        changePanel: (direction) => dispatch({
            type: ActionTypes.CHANGE_PANEL,
            direction: direction
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
