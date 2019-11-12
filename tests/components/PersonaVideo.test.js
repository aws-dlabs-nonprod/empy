import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';
import theme from '@style/theme';

import PersonaVideo from '@components/PersonaVideo';

const mockStore = configureStore([]);

describe('PersonaVideo', () => {

    test('renders correctly', () => {
        const store = mockStore({});

        const component = mount(
            <Provider store={store}>
                <PersonaVideo theme={ theme } />
            </Provider>
        );

        expect(component.find(PersonaVideo)).toMatchSnapshot();
    });

    test('handles connection', () => {
        const store = mockStore({
            isConnected: true
        });

        const component = mount(
            <Provider store={store}>
                <PersonaVideo theme={ theme } />
            </Provider>
        );

        expect(component.find(PersonaVideo)).toMatchSnapshot();
    });
});
