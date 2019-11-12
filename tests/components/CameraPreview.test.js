import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import 'jest-styled-components';

import CameraPreview from '@components/CameraPreview';

const mockStore = configureStore([]);

describe('CameraPreview', () => {

    test('renders correctly', () => {
        const store = mockStore({});

        const component = shallow(
            <Provider store={store}>
                <CameraPreview />
            </Provider>
        );

        expect(component).toMatchSnapshot();
    });
});
