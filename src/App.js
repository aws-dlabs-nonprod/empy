import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SoulMachinesProvider } from '@contexts/SoulMachines';
import * as ActionTypes from '@constants/ActionTypes';
import { smwebsdk } from '@soulmachines/smwebsdk';
import { supportsAudioOnly, isCompatible } from '@utils/helpers';

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

class App extends Component {

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
    }

    componentDidMount() {
        // Detect device capabilities
        smwebsdk.DetectCapabilities().then((result) => {
            this.props.setFeatures({
                hasCamera: result.hasCamera,
                hasMicrophone: result.hasMicrophone,
                isBrowserSupported: result.isBrowserSupported && isCompatible(),
                allowAudioOnly: supportsAudioOnly()
            });
        });
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
            showFeedback,
            isInfoPanelOpen,
            infoPanels,
            isTranscriptOpen,
            activePanelIndex,
            showWayfinders,
            wayfinder
        } = this.props;

        return (
            <Container>
                { !isConnected && <IntroVideo /> }

                <PersonaVideo />

                <Header />

                { !isConnected && <IntroPanel /> }

                <Transcript />

                <Wayfinder { ...wayfinder } isOpen={ showWayfinders && !isTranscriptOpen } isStandAlone={ true } />

                <Footer />

                <Feedback isVisible={ isConnected && showFeedback } />

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
        showFeedback: state.showFeedback,
        isInfoPanelOpen: state.isInfoPanelOpen,
        infoPanels: state.infoPanels,
        activePanelIndex: state.activePanelIndex,
        wayfinder: state.wayfinder,
        showWayfinders: state.showWayfinders,
        isTranscriptOpen: state.isTranscriptOpen
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setFeatures: (features) => dispatch({
            type: ActionTypes.SET_FEATURES,
            features
        }),

        changePanel: (direction) => dispatch({
            type: ActionTypes.CHANGE_PANEL,
            direction
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
