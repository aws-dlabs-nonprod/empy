import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import Loader from '@components/Loader';

describe('Loader', () => {

    test('renders correctly', () => {
        const component = shallow(
            <Loader />
        );

        expect(component).toMatchSnapshot();
    });
});
