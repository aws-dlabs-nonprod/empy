import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import { ThemeProvider } from 'styled-components';
import theme from '@style/theme';

import Footer from '@components/Footer';

const mockStore = configureStore([]);

describe('Footer', () => {

    test('renders correctly', () => {
        const store = mockStore({
            isConnected: false,
            infoPanels: []
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <Footer />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Footer)).toMatchSnapshot();
    });

    test('toggles correctly', () => {
        const store = mockStore({
            isConnected: true,
            infoPanels: []
        });

        const component = mount(
            <Provider store={ store }>
                <ThemeProvider theme={ theme }>
                    <Footer />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Footer)).toMatchSnapshot();
    });

});
