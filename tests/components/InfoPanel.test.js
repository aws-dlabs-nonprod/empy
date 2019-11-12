import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { InfoPanel } from '@components/InfoPanel';

describe('InfoPanel', () => {

    test('renders correctly', () => {
        const component = shallow(
            <InfoPanel />
        );

        expect(component).toMatchSnapshot();
    });
});
