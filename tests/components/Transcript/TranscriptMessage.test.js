import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import TranscriptMessage from '@components/Transcript/TranscriptMessage';

describe('TranscriptMessage', () => {

    test('renders correctly', () => {
        const component = shallow(
            <TranscriptMessage />
        );

        expect(component).toMatchSnapshot();
    });

    test('renders loading', () => {
        const component = shallow(
            <TranscriptMessage loading={ true } />
        );

        expect(component).toMatchSnapshot();
    });

    test('renders content', () => {
        const component = shallow(
            <TranscriptMessage loading={ false } content="message" />
        );

        expect(component).toMatchSnapshot();
        expect(component.text()).toEqual('message');
    });

});
