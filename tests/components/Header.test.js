import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import { ThemeProvider } from 'styled-components';
import theme from '@style/theme';

import Header from '@components/Header';

const mockStore = configureStore([]);

// Mock getUserMedia
global.navigator.mediaDevices = {
    getUserMedia: () => {
        return new Promise(resolve => {});
    }
};

describe('Header', () => {

    test('renders correctly', () => {
        const store = mockStore({});

        const component = mount(
            <Provider store={store}>
                <ThemeProvider theme={ theme }>
                    <Header />
                </ThemeProvider>
            </Provider>
        );

        expect(component.find(Header)).toMatchSnapshot();
    });

});
