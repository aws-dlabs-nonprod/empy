import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import * as PersonaState from '@constants/PersonaState';
import { Indicator } from '@components/Indicator';

describe('Indicator', () => {

    test('renders correctly', () => {
        const component = shallow(
            <Indicator />
        );

        expect(component).toMatchSnapshot();
    });
    

    test('renders speaking', () => {
        const component = shallow(
            <Indicator personaState={ PersonaState.STATE_SPEAKING } />
        );

        expect(component).toMatchSnapshot();
    });

});
