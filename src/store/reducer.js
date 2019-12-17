import * as ActionTypes from '@constants/ActionTypes';
import * as PersonaState from '@constants/PersonaState';
import Source from '@constants/Source';
import { isDesktop } from '@utils/helpers';
import * as ComponentType from '@constants/ComponentType';

export const initialState = {
    isTranscriptOpen: false,
    isPersonaVideoShrunk: false,
    transcript: [],
    isInfoPanelOpen: false,
    infoPanels: [],
    wayfinder: {
        title: '',
        options: []
    },
    showWayfinders: false,
    activePanelIndex: 0,
    personaState: PersonaState.STATE_IDLE,
    userMessage: '',
    isConnected: false,
    showFeedback: false,
    isLoading: false,
    isMuted: false,
    isPaused: false,
    isUserSpeaking: false,
    hasCamera: false,
    hasMicrophone: false,
    isBrowserSupported: true,
    allowAudioOnly: false,
    isVideoCollapsed: false,
    isVideoEnabled: false,
    hasSeenMicrophonePrompt: false,
    hasSeenDontUnderstandPrompt: false,
    isNotUnderstanding: false,
    cameraPosition: 0.5 // Horizontal percentage
};

const generateKey = () => {
    return `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
};

const rootReducer = (state = initialState, action) => {
    let message = {};

    let {
        transcript,
        infoPanels,
        activePanelIndex,
        isInfoPanelOpen,
        isTranscriptOpen,
        isPersonaVideoShrunk,
        showWayfinders
    } = state;

    switch (action.type) {
        case ActionTypes.TRANSCRIPT_TOGGLE:
            return {
                ...state,
                isTranscriptOpen: action.isToggled,
                isInfoPanelOpen: false,

                // Don't show transcript prompts after its been opened
                hasSeenMicrophonePrompt: true,
                hasSeenDontUnderstandPrompt: true
            };

        case ActionTypes.TRANSCRIPT_SEND_MESSAGE:
            message = {
                source: Source.ME,
                content: action.message,
                key: generateKey()
            };

            const thinker = { loading: true };

            // Remove any thinking placeholders
            transcript = state.transcript.filter((message) =>
                !message.loading);

            return {
                ...state,
                userMessage: action.message,
                transcript: [...transcript, message, thinker],
                showWayfinders: false
            };

        case ActionTypes.TRANSCRIPT_PUSH_MESSAGE:
            message = action.message;
            transcript = state.transcript;

            // Assign a key
            message.key = generateKey();

            // Remove any existing wayfinder messages
            transcript = transcript.filter((message) => {
                if (message.panel && message.panel.type === ComponentType.WAYFINDER) {
                    return false;
                }
                
                return true;
            });

            // Remove any existing thinking placeholders
            if (!action.thinking) {
                transcript = transcript.filter((message) =>
                    !message.loading);
            }

            // Message comes with a panel, assign an index and make it active.
            // Wayfinder panels shouldn't go into the separate info panel drawer
            if (message.panel && message.panel.type !== ComponentType.WAYFINDER) {
                message.panel.index = state.infoPanels.length;
                activePanelIndex = message.panel.index;

                infoPanels.push(message.panel);

                // On desktop, if the transcript is closed, open the info panel
                if (!state.isTranscriptOpen && isDesktop()) {
                    isInfoPanelOpen = true;
                }

                // On mobile, open the transcript to view the panel
                if (!state.isTranscriptOpen && !isDesktop()) {
                    isTranscriptOpen = true;
                    isPersonaVideoShrunk = true;
                }
            }

            transcript.push(message);

            // Add a new thinking placeholder
            if (action.thinking) {
                transcript.push({ loading: true, key: generateKey() });
            }

            return {
                ...state,
                activePanelIndex: activePanelIndex,
                transcript: [...transcript],
                infoPanels: [...infoPanels],
                isInfoPanelOpen,
                isTranscriptOpen,
                isPersonaVideoShrunk,
                showWayfinders: showWayfinders && !action.hideWayfinder
            };

        case ActionTypes.TRANSCRIPT_RESET_MESSAGE:
            return {
                ...state,
                userMessage: ''
            };

        case ActionTypes.SET_PERSONA_STATE:
            return {
                ...state,
                personaState: action.state
            };

        case ActionTypes.SCENE_START_VIDEO:
            return {
                ...state,
                isVideoEnabled: true
            };

        case ActionTypes.SCENE_START_AUDIO:
            return {
                ...state,
                isVideoEnabled: false
            };

        case ActionTypes.SCENE_CONNECTED:
            return {
                ...state,
                isConnected: true,
                isLoading: false
            };

        case ActionTypes.SCENE_DISCONNECTED:
            return {
                ...state,
                isConnected: false,
                isTranscriptOpen: false,
                showWayfinders: false,
                isPersonaVideoShrunk: false,
                transcript: [],
                infoPanels: [],
                hasSeenMicrophonePrompt: false,
                hasSeenDontUnderstandPrompt: false,
                isMuted: false
            };

        case ActionTypes.SET_FEATURES:
            return {
                ...state,
                ...action.features
            };

        case ActionTypes.TOGGLE_MUTE:
            return {
                ...state,
                isMuted: !state.isMuted
            };

        case ActionTypes.TOGGLE_PAUSE:
            return {
                ...state,
                isPaused: !state.isPaused
            };

        case ActionTypes.TOGGLE_INFO_PANEL:
            // If the transcript is open, just highlight the latest info panel
            if (state.isTranscriptOpen) {
                return {
                    ...state,
                    activePanelIndex: state.infoPanels.length - 1,
                };
            }

            return {
                ...state,
                isInfoPanelOpen: !state.isInfoPanelOpen
            };

        case ActionTypes.START_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case ActionTypes.STOP_LOADING:
            return {
                ...state,
                isLoading: false
            };

        case ActionTypes.HIDE_FEEDBACK:
            return {
                ...state,
                showFeedback: false,
                isMuted: false
            };

        case ActionTypes.SHOW_FEEDBACK:
            return {
                ...state,
                showFeedback: true,
                isMuted: true // Stop listening if we're ending the session
            };

        case ActionTypes.CHANGE_PANEL:
            let nextPanel = state.activePanelIndex;

            if (action.direction) {
                nextPanel = state.activePanelIndex + action.direction;
            } else {
                nextPanel = action.newIndex;
            }

            nextPanel = Math.min(nextPanel, state.infoPanels.length - 1);
            nextPanel = Math.max(nextPanel, 0);

            return {
                ...state,
                activePanelIndex: nextPanel
            };
    
        case ActionTypes.NOT_UNDERSTANDING:
            return {
                ...state,
                isNotUnderstanding: true,
                hasSeenDontUnderstandPrompt: false
            };

        case ActionTypes.TOGGLE_VIDEO_COLLAPSE:
            return {
                ...state,
                isVideoCollapsed: !state.isVideoCollapsed
            };

        case ActionTypes.SET_USER_SPEAKING:
            return {
                ...state,
                isUserSpeaking: action.isUserSpeaking
            };

        case ActionTypes.HIDE_WAYFINDER:
            return {
                ...state,
                showWayfinders: false
            };

        case ActionTypes.SHOW_WAYFINDER:
            // On mobile devices the wayfinder is only visible in the transcript
            if (!isDesktop()) {
                isTranscriptOpen = true;
                isPersonaVideoShrunk = true;
            }

            return {
                ...state,
                showWayfinders: true,
                isTranscriptOpen,
                isPersonaVideoShrunk,
                wayfinder: {
                    title: action.title,
                    options: action.options
                }
            };

        case ActionTypes.TOGGLE_PERSONA_SHRINK:
            return {
                ...state,
                isPersonaVideoShrunk: action.isToggled
            };
    }

    return state;
};

export default rootReducer;
