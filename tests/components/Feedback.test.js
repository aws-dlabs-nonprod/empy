import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

import Feedback from '@components/Feedback';

describe('Feedback', () => {

    test('renders correctly', () => {
        const store = mockStore({
            isConnected: false
        });

        const component = shallow(
            <Provider store={store}>
                <Feedback />
            </Provider>
        );

        expect(component).toMatchSnapshot();
    });
});
