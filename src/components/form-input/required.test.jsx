import React from 'react';
import { mount } from 'enzyme';

import { FormInputRequired } from './required';

describe('FormInputRequired', () => {
    it('should match the snapshot', () => {
        const wrapper = mount(<FormInputRequired required />);

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders FormInputRequired if required prop is true and fieldError prop is not supplied', () => {
        const wrapper = mount(<FormInputRequired required />);

        expect(wrapper.text()).toEqual('* Required');
    });

    it('does not render FormInputRequired if required prop is true but fieldError prop is supplied', () => {
        const wrapper = mount(
            <FormInputRequired fieldError="Error message example" required />
        );

        expect(wrapper.html()).toBeNull();
    });

    it('does not render FormInputRequired if required prop is false', () => {
        const wrapper = mount(<FormInputRequired />);

        expect(wrapper.html()).toBeNull();
    });
});