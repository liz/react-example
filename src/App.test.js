import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import SaveKey from './save-key';

describe('App', () => {
	it('renders SaveKey when apiKey prop is not supplied', () => {
		const wrapper = shallow(<App />);
		expect(wrapper.find(SaveKey)).toHaveLength(1);
	});
});