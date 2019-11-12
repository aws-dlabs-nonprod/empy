import * as ActionTypes from '@constants/ActionTypes';
import * as PersonaState from '@constants/PersonaState';
import Source from '@constants/Source';
import { isMobile } from '@utils/helpers';

export const initialState = {
    isTranscriptOpen: false,
    transcript: [
        /*
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.ME,
            content: 'Labore ipsum anim ut laboris eu nulla in aute eu mollit commodo culpa.',
        },
        {
            source: Source.PERSONA,
            panel: {
                index: 0,
                type: 'text',
                data: {
                    text: 'Hello World'
                }
            }
        },
        {
            source: Source.PERSONA,
            panel: {
                index: 1,
                type: 'image',
                data: {
                    url: 'https://images.unsplash.com/photo-1572105519405-7d5dbafe2d26?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max'
                }
            }
        },
        {
            source: Source.PERSONA,
            panel: {
                index: 2,
                type: 'image',
                data: {
                    url: 'https://images.unsplash.com/photo-1571578236457-311828cfb129?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max'
                }
            }
        }
        */
    ],
    isInfoPanelOpen: false,
    infoPanels: [
        /*
        {
            type: 'text',
            data: {
                text: 'Hello World'
            }
        },
        {
            type: 'image',
            data: {
                url: 'https://images.unsplash.com/photo-1572105519405-7d5dbafe2d26?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max'
            }
        },
        {
            type: 'image',
            data: {
                url: 'https://images.unsplash.com/photo-1571578236457-311828cfb129?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max'
            }
        }
        */
    ],
    wayfinders: [],
    showWayfinders: false,
    activePanelIndex: 0,
    personaState: PersonaState.STATE_IDLE,
    userMessage: '',
    isConnected: false,
    isFinished: false,
    isLoading: false,
    isMuted: false,
    isPaused: false,
    isUserSpeaking: false,
    hasCamera: false,
    hasMicrophone: false,
    isBrowserSupported: true,
    isSafari: false,
    isVideoCollapsed: false,
    isVideoEnabled: false,
    hasSeenMicrophonePrompt: false,
    hasSeenDontUnderstandPrompt: false,
    isNotUnderstanding: false,
    videoWidth: 0,
    videoHeight: 0,
    cameraPosition: 0.5 // Horizontal percentage
};

const rootReducer = (state = initialState, action) => {
    let transcript = state.transcript;
    let infoPanels = state.infoPanels;
    let message = {};
    let activePanelIndex = state.activePanelIndex;
    let isInfoPanelOpen = state.isInfoPanelOpen;
    let isTranscriptOpen = state.isTranscriptOpen;

    switch (action.type) {
        case ActionTypes.TRANSCRIPT_TOGGLE:
            return {
                ...state,
                isTranscriptOpen: !state.isTranscriptOpen,
                isInfoPanelOpen: false,

                // Don't show transcript prompts after its been opened
                hasSeenMicrophonePrompt: true,
                hasSeenDontUnderstandPrompt: true
            };

        case ActionTypes.TRANSCRIPT_SEND_MESSAGE:
            message = {
                source: Source.ME,
                content: action.message
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

            // Remove any existing thinking placeholders
            if (!action.thinking) {
                transcript = transcript.filter((message) =>
                    !message.loading);
            }

            // Message comes with a panel, assign an index and make it active
            if (message.panel) {
                message.panel.index = state.infoPanels.length;
                activePanelIndex = message.panel.index;

                infoPanels.push(message.panel);

                // On desktop, if the transcript is closed, open the info panel
                if (!state.isTranscriptOpen && !isMobile()) {
                    isInfoPanelOpen = true;
                }

                // On mobile, open the transcript to view the panel
                if (!state.isTranscriptOpen && isMobile()) {
                    isTranscriptOpen = true;
                }
            }

            transcript.push(message);

            // Add a new thinking placeholder
            if (action.thinking) {
                transcript.push({ loading: true });
            }

            return {
                ...state,
                activePanelIndex: activePanelIndex,
                transcript: [...transcript],
                infoPanels: [...infoPanels],
                isInfoPanelOpen,
                isTranscriptOpen,
                showWayfinders: false
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

        case ActionTypes.SET_VIDEO_BOUNDS:
            return {
                ...state,
                videoWidth: action.width,
                videoHeight: action.height
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
                transcript: [],
                infoPanels: [],
                hasSeenMicrophonePrompt: false,
                hasSeenDontUnderstandPrompt: false,
                isMuted: false,
                isFinished: action.isFinished
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

        case ActionTypes.FEEDBACK_SUBMIT:
            return {
                ...state,
                isFinished: false
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

        case ActionTypes.ANIMATE_CAMERA:
            return {
                ...state,
                camera: action.camera
            };

        case ActionTypes.NOT_UNDERSTANDING:
            return {
                ...state,
                isNotUnderstanding: true
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
            return {
                ...state,
                showWayfinders: true,
                wayfinders: action.wayfinders
            };
    }

    return state;
};

export default rootReducer;
