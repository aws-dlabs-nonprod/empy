import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'whatwg-fetch';
import * as ActionTypes from '@constants/ActionTypes';
import * as PersonaState from '@constants/PersonaState';
import * as ComponentType from '@constants/ComponentType';
import Source from '@constants/Source';
import retryOperation from '@utils/retry';
import { smwebsdk } from '@soulmachines/smwebsdk';
import nanobus from 'nanobus';
import { isDesktop } from '@utils/helpers';
import { NeuralPosition } from '@utils/camera';

const SoulMachinesContext = React.createContext();

class SoulMachinesProvider extends Component {

    constructor() {
        super();

        this.state = {
            isConnected: false,
            personaVideoObject: null
        };

        this.publicFunctions = {
            connect: this.connect,
            createScene: this.createScene,
            disconnect: this.disconnect,
            updateVideoSize: this.updateVideoSize,
            animateCamera: this.animateCamera.bind(this),
            resizeCamera: this.resizeCamera.bind(this),
            sendMessage: this.sendMessage,
            videoStart: this.videoStart
        };

        this.contextData = {};
        this.eventBus = nanobus();
        this.checkInterval = null;
        this.checkIterations = 0;
        this.focusTimeout = null;

        this.handleMessage = this.handleMessage.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleConversationResult = this.handleConversationResult.bind(this);
        this.handleRecognizeResults = this.handleRecognizeResults.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleSpeechMarker = this.handleSpeechMarker.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.videoStart = this.videoStart.bind(this);
        this.handleVisiblityChange = this.handleVisiblityChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentDidMount() {
        this.proxyVideo = document.createElement('video');

        document.addEventListener('visibilitychange', this.handleVisiblityChange);
        window.addEventListener('blur', this.handleBlur);
        window.addEventListener('focus', this.handleFocus);
    }

    componentDidUpdate(prevProps) {
        const { isMuted } = this.props;

        // Mute toggled
        if (isMuted !== prevProps.isMuted) {
            this.handleRecognizeToggle();
        }
    }

    /**
     * A typed message is received from the UI, send to the persona
     */
    sendMessage = (message, hideWayfinder = false) => {
        message = message.trim();

        if (!message) {
            return;
        }

        if (this.persona) {

            // Add the message to the transcript
            const transcriptEntry = {
                source: Source.ME,
                content: message,
            };

            this.props.pushMessage(transcriptEntry, true, true);

            // Send the message to the persona
            retryOperation(() => {
                return this.persona.conversationSend(message);
            }, 1000, 3);

            // Wait for the transcript to redraw,
            // then scroll to the bottom to see the new message
            setTimeout(() => {
                this.eventBus.emit('scroll:bottom');
            }, 100);

            if (hideWayfinder) {
                this.props.hideWayfinder();
            }
        }
    }

    /**
     * Triggered when the user returns to our browser window
     */
    handleFocus(event) {
        // Reset our disconnection timer
        clearTimeout(this.focusTimeout);
    }

    /**
     * Triggered when the user minimises the browser or switches to another app
     */
    handleBlur(event) {
        const { target: { document } } = event;

        // We don't want to disconnect if we're clicking into the feedback iframe
        if (document.activeElement.getAttribute('id') === 'feedback-frame') {
            return;
        }

        // Clear any existing timers
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }

        // Disconnect the session if we don't regain focus within 30 seconds
        this.focusTimeout = setTimeout(() => {
            this.disconnect();
        }, 30000);
    }

    /**
     * Triggered when the user changes tabs
     */
    handleVisiblityChange() {
        /*
         * This poll loop is to solve a race condition where you can click the
         * start button then cause the page to loose focus. If we disconnected
         * immediately, it would be reinstated once the connection request
         * completed in the background.
         *
         * Here we are waiting until we are connected before we perform a
         * disconnection, giving up after 20 attempts (10 seconds).
         */
        const checkConnection = () => {
            const { isConnected } = this.props;

            if (this.checkIterations > 20) {
                clearInterval(this.checkInterval);
            }

            if (isConnected) {
                clearInterval(this.checkInterval);

                this.disconnect();

                this.props.showFeedback();
            }

            this.checkIterations++;
        };

        // We've lost focus to the page, so disconnect
        if (document.visibilityState === 'hidden') {
            clearInterval(this.checkInterval);
            this.checkInterval = setInterval(checkConnection.bind(this), 500);
        } else {
            // We've come back, so reset the counter
            clearInterval(this.checkInterval);
            this.checkIterations = 0;
        }
    }

    /**
     * Tell the persona to start or stop listening to microphone input
     */
    handleRecognizeToggle() {
        const { isMuted } = this.props;

        if (!this.scene) {
            return;
        }

        const command = `${isMuted ? 'stop' : 'start'}Recognize`;

        this.scene.sendRequest(command, {});
    }

    /**
     * Generic handler for all messages received from the SDK
     */
    handleMessage(message) {
        if (message.kind !== 'event') {
            return;
        }

        switch (message.name) {
            case 'close':
                this.disconnect();
                break;
        }
    }

    /**
     * Scene has been disconnected by the SDK, likely due to inactivity
     */
    handleDisconnect() {
        this.disconnect();
    }

    /**
     * When the video source has buffered enough to start playing.
     * Should be when the persona is first 'visible' to the user.
     */
    videoStart = () => {

    }

    /**
     * A @marker() has been received
     */
    handleSpeechMarker(persona, marker) {
        // Loop through each marker in the message
        for (let i = 0; i < marker.arguments.length; i++) {
            const key = marker.arguments[i];

            // There's no context data for the marker, so it's probably a UI prompt
            if (!this.contextData[key]) {
                this.handleMarkerPrompt(key);
                continue;
            }

            const content = this.contextData[key];

            if (content) {
                const isWayfinder = content.component
                    === ComponentType.WAYFINDER;

                // Content is a wayfinder
                if (isWayfinder) {
                    const { title, options } = content.data;
                    
                    this.props.showWayfinder(title, options);
                }

                // Content is an info panel
                const transcriptEntry = {
                    source: Source.PERSONA,
                    panel: {
                        type: content.component,
                        data: content.data,
                    }
                };

                this.props.pushMessage(transcriptEntry, false, !isWayfinder);

                this.eventBus.emit('scroll:bottom');
            }
        }
    }

    /**
     * A marker was received which didn't relate to context data.
     * Handle it as a trigger in the UI somehow.
     */
    handleMarkerPrompt(key) {
        switch (key) {
            // Persona doesn't understand what you've said
            case 'dont-understand':
                this.props.setNotUnderstanding();
                break;
        }
    }

    /**
     * Triggered when the persona responds to a user message.
     * May contain extra information such as context data.
     */
    handleConversationResult(persona, message) {
        const { context } = message.output;

        // If we have new context data, merge it in
        this.contextData = {
            ...this.contextData,
            ...context
        };
    }

    /**
     * User speech is recognised
     */
    handleRecognizeResults(scene, status, errorMessage, results) {
        // Start the UI speech indicator
        this.props.setUserSpeaking(true);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            // Add the message to our transcript
            if (result.final) {
                const transcriptEntry = {
                    source: Source.ME,
                    content: result.alternatives[0].transcript,
                };

                this.props.pushMessage(transcriptEntry, true, true);

                // Stop the UI speech indicator
                this.props.setUserSpeaking(false);

                this.eventBus.emit('scroll:bottom');
            }
        }
    }

    /**
     * Persona state update received
     */
    handleState(scene, state) {
        let persona = null;

        try {
            persona = state.persona[PERSONA_ID];
        } catch (e) {
            return;
        }

        // Update the persona state
        if (persona.speechState) {
            this.props.setPersonaState(persona.speechState);
        }

        // Check if they're speaking
        const isSpeaking = persona.speechState === PersonaState.STATE_SPEAKING;
        const spokenMessage = persona.currentSpeech;

        // Capture the persona message
        if (isSpeaking && spokenMessage) {
            const message = {
                source: Source.PERSONA,
                content: spokenMessage
            };

            this.props.pushMessage(message, false);

            // Scroll to the bottom to see the new message
            this.eventBus.emit('scroll:bottom');
        }
    }

    /**
     * Handle an exception when the user rejects mic/camera permissions
     */
    handleBlockedPermissions() {
        if (!this.scene) {
            return;
        }

        const { microphone, microphoneAndCamera } = smwebsdk.userMedia;

        // Disable the requested features (which were blocked)
        switch (this.requestedUserMedia) {
            case microphone:
                this.props.setFeatures({
                    hasMicrophone: false
                });
                break;

            case microphoneAndCamera:
                this.props.setFeatures({
                    hasCamera: false,
                    hasMicrophone: false
                });
                break;
        }
    }

    /**
     * Generic handler for connection issues;
     *
     * serverConnectionFailed: the connection to the server failed
     * noScene: no persona was available
     * mediaStreamFailed: the audio/video stream failed
     * sessionTimeout: the session timed out before it was fully available
     */
    handleError(e) {
        switch (e.name) {
            case 'serverConnectionFailed':
            case 'noScene':
            case 'mediaStreamFailed':
            case 'sessionTimeout':
                // Handle the error in the UI
                break;
        }
    }

    /**
     * Animate the camera to the desired settings.
     * See utils/camera.js for help with calculating these.
     *
     * options {
     *   tiltDeg: 0,
     *   orbitDegX: 0,
     *   orbitDegY: 0,
     *   panDeg: 0,
     * }
     */
    animateCamera(options, duration = 1) {
        if (!this.scene) {
            return;
        }

        // There's no horizontal movement on mobile, reset position
        if (!isDesktop()) {
            options = NeuralPosition;
        }

        this.scene.sendRequest('animateToNamedCamera', {
            cameraName: CAMERA_ID,
            personaId: PERSONA_ID,
            time: duration,
            ...options
        });
    }

    /**
     * Update the video size on the persona server
     */
    resizeCamera(width, height) {
        if (!this.scene) {
            return;
        }

        this.scene.sendVideoBounds(Math.ceil(width), Math.ceil(height));
    }

    /**
     * Set up a new persona and scene with the desired camera/mic settings
     */
    createScene = (audioOnly = false) => {
        const { microphone, microphoneAndCamera } = smwebsdk.userMedia;

        this.requestedUserMedia = audioOnly ? microphone : microphoneAndCamera;

        this.scene = new smwebsdk.Scene(
            this.proxyVideo,
            false,
            this.requestedUserMedia,
            microphone
        );

        this.persona = new smwebsdk.Persona(this.scene, PERSONA_ID);
        this.persona.onSpeechMarkerEvent.addListener(this.handleSpeechMarker);
        this.persona.onConversationResultEvent.addListener(this.handleConversationResult);

        this.scene.onDisconnected = this.handleDisconnect;
        this.scene.onState = this.handleState;
        this.scene.onRecognizeResults = this.handleRecognizeResults;

        // Store a ref to the smwebsdk onmessage so that we can
        // use the callback while also calling the internal version
        const smwebsdkOnMessage = this.scene.onMessage.bind(this.scene);

        this.scene.onMessage = (message) => {
            // Removing this will break smwebsdk eventing
            smwebsdkOnMessage(message);

            this.handleMessage(message);
        };

        this.scene.onDisconnected = this.handleDisconnect;

        return this.connect();
    }

    /**
     * Get a token and use it to connect to the session server
     */
    connect = () => {
        const jwtUrl = `${TOKEN_ISSUER}`;

        const retryOptions = {
            maxRetries: 10,
            delayMs: 500
        };

        return fetch(jwtUrl, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                this.scene.connect(`${data.url}/${SCENE}`,
                    '', data.jwt, retryOptions)
                    .then(() => this.onConnected())
                    .catch((e) => {
                        console.error(e.name);

                        // Try to determine what went wrong
                        switch (e.name) {
                            case 'notSupported':
                            case 'noUserMedia':
                                this.handleBlockedPermissions();
                                break;

                            default:
                                this.handleError(e);
                                break;
                        }
                    });
            })
            .catch((error) => {
                console.error(error);

                this.props.stopLoading();
            });
    }

    /**
     * Scene has connected, we're ready to go!
     */
    onConnected() {
        this.setState({
            isConnected: true,
            personaVideoObject: this.proxyVideo.srcObject
        });

        setTimeout(() => {
            this.props.sceneConnected();
        }, 500);
    }

    /**
     * Scene has been disconnected, this could be because it was manually ended
     * by the user, or it has timed out due to inactivity.
     */
    disconnect = () => {
        this.props.sceneDisconnected();

        // Delay the actual disconnection until we've transitioned the video out
        // See <PersonaVideo />
        setTimeout(() => {
            if (this.scene) {
                this.scene.disconnect();
            }

            this.setState({
                isConnected: false
            });

            delete this.scene;
            delete this.persona;
        }, 600);
    }

    render() {
        return (
            <SoulMachinesContext.Provider
                value={{ ...this.state, ...this.publicFunctions, eventBus: this.eventBus }} >
                {this.props.children}
            </SoulMachinesContext.Provider>
        );
    }
}

function mapStateToProps(state) {
    return {
        userMessage: state.userMessage,
        videoWidth: state.videoWidth,
        videoHeight: state.videoHeight,
        isMuted: state.isMuted,
        camera: state.camera,
        isConnected: state.isConnected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        pushMessage: (message, thinking, hideWayfinder) => dispatch({
            type: ActionTypes.TRANSCRIPT_PUSH_MESSAGE,
            message,
            thinking,
            hideWayfinder
        }),

        resetMessage: () => dispatch({
            type: ActionTypes.TRANSCRIPT_RESET_MESSAGE
        }),

        setPersonaState: (state) => dispatch({
            type: ActionTypes.SET_PERSONA_STATE,
            state: state
        }),

        sceneConnected: () => dispatch({
            type: ActionTypes.SCENE_CONNECTED
        }),

        sceneDisconnected: () => dispatch({
            type: ActionTypes.SCENE_DISCONNECTED
        }),

        setFeatures: (features) => dispatch({
            type: ActionTypes.SET_FEATURES,
            features: features
        }),

        stopLoading: () => dispatch({
            type: ActionTypes.STOP_LOADING
        }),

        setNotUnderstanding: () => dispatch({
            type: ActionTypes.NOT_UNDERSTANDING
        }),

        setUserSpeaking: (isUserSpeaking) => dispatch({
            type: ActionTypes.SET_USER_SPEAKING,
            isUserSpeaking
        }),

        showWayfinder: (title, options) => dispatch({
            type: ActionTypes.SHOW_WAYFINDER,
            title,
            options
        }),

        hideWayfinder: () => dispatch({
            type: ActionTypes.HIDE_WAYFINDER
        }),

        showFeedback: () => dispatch({
            type: ActionTypes.SHOW_FEEDBACK
        })
    };
}

const ConnectedSoulMachinesProvider =
    connect(mapStateToProps, mapDispatchToProps)(SoulMachinesProvider);

export {
    ConnectedSoulMachinesProvider as SoulMachinesProvider,
    SoulMachinesContext,
};
