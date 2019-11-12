import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import theme from '@style/theme';
import { ThemeProvider } from 'styled-components';

import IntroPanel from '@components/IntroPanel';
import Button, { SecondaryButton } from '@components/Button';

const mockStore = configureStore([]);

describe('IntroPanel', () => {

    test('renders correctly', () => {
        const store = mockStore({});

        const component = shallow(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <IntroPanel />
                </ThemeProvider>
            </Provider>
        );

        expect(component).toMatchSnapshot();
    });

    test('handles no devices', () => {
        const store = mockStore({
            hasCamera: false,
            hasMicrophone: false,
            isBrowserSupported: true
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <IntroPanel />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Button).length).toEqual(0);
        expect(component.text()).toContain('you don\'t have a camera or microphone');
    });

    test('handles only microphone', () => {
        const store = mockStore({
            hasCamera: false,
            hasMicrophone: true,
            isBrowserSupported: true
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <IntroPanel />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Button).length).toEqual(1);
        expect(component.text()).toContain('Start a voice chat');
    });

    test('handles camera and microphone', () => {
        const store = mockStore({
            hasCamera: true,
            hasMicrophone: true,
            isBrowserSupported: true
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <IntroPanel />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Button).length).toEqual(1);
        expect(component.find(SecondaryButton).length).toEqual(1);
        expect(component.text()).toContain('Start a video chat');
        expect(component.text()).toContain('Start a voice chat');
    });

    test('handles unsupported browser', () => {
        const store = mockStore({
            hasCamera: true,
            hasMicrophone: true,
            isBrowserSupported: false
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <IntroPanel />
                </ThemeProvider>
            </Provider>
        );

        expect(component.text()).toContain('It looks like the browser or device you\'re using is not supported.');
    });
});
