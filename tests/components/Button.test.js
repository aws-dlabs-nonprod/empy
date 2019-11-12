import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-styled-components';
import theme from '@style/theme';

import Button from '@components/Button';
import Tip from '@components/ButtonTip';

describe('Button', () => {

    test('renders correctly', () => {
        const component = shallow(<Button theme={ theme } />);

        expect(component).toMatchSnapshot();
    });

    test('toggles correctly', () => {
        const component = mount(
            <Button
                theme={ theme }
                isToggled={ false }
                tip="off message"
                toggleTip="on message"
            />
        );

        expect(component.find(Tip).text()).toEqual('off message');

        component.setProps({ isToggled: true });

        expect(component.find(Tip).text()).toEqual('on message');
    });

    test('handles click', () => {
        const mockCallback = jest.fn();

        const component = shallow(
            <Button theme={ theme } onClick={ mockCallback } />
        );

        component.simulate('click');

        expect(mockCallback).toHaveBeenCalled();
    });

});
