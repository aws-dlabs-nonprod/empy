import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import { SoulMachinesProvider } from '@contexts/SoulMachines';
import theme from '@style/theme';
import { ThemeProvider } from 'styled-components';

import Transcript from '@components/Transcript/Transcript';
import TranscriptMessage from '@components/Transcript/TranscriptMessage';

const mockStore = configureStore([]);

describe('Transcript', () => {

    test('renders correctly', () => {
        const store = mockStore({
            isConnected: false,
            isTranscriptOpen: false,
            transcript: []
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <SoulMachinesProvider>
                        <Transcript />
                    </SoulMachinesProvider>
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Transcript)).toMatchSnapshot();
    });

    test('handles connection', () => {
        const store = mockStore({
            isTranscriptOpen: true,
            isConnected: true,
            transcript: [
                { source: 'me', content: 'Hello' },
                { source: 'persona', content: 'Hello' }
            ],
            infoPanels: [],
            activePanelIndex: 0
        });

        const component = mount(
            <Provider store={store}>
                <ThemeProvider theme={ theme }>
                    <SoulMachinesProvider>
                        <Transcript />
                    </SoulMachinesProvider>
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Transcript)).toMatchSnapshot();
        expect(component.find(TranscriptMessage).length).toEqual(2);
    });
});
