import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import theme from '@style/theme';
import { ThemeProvider } from 'styled-components';

import { ChatInput } from '@components/Transcript/ChatInput';

const mockStore = configureStore([]);

describe('ChatInput', () => {

    test('renders correctly', () => {
        const store = mockStore({});

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <ChatInput />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(ChatInput)).toMatchSnapshot();
    });

    test('handles transcript', () => {
        const store = mockStore({
            isTranscriptOpen: true
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <ChatInput />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(ChatInput)).toMatchSnapshot();
    });

});
