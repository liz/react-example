import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { act } from 'react-dom/test-utils';

import { SaveKey } from './save-key';
import theme from './theme';

const mockStore = configureMockStore();
const store = mockStore({});

describe('SaveKey', () => {
	// let wrapper = mount(
	// 	<Provider store={store}>
	// 		<SaveKey />
	// 	</Provider>
	// );

	let wrapper;

	beforeEach(() => {
	   wrapper = mount(
			<Provider store={store}>
				<SaveKey />
			</Provider>
		);
    });

	afterEach(() => {
        jest.resetAllMocks();
    });

	describe('Renders', () => {
		it('should match the snapshot', () => {
	    	expect(wrapper.html()).toMatchSnapshot();
	  	});

	  	it('renders FormInput with expected props', () => {
	    	expect(wrapper.find('FormInput')).toHaveLength(1);
			expect(wrapper.find('FormInput').props()).toEqual({
				value: '',
				fieldChange: expect.any(Function),
				placeHolder: 'Github API Key',
				fieldId: 'save-key',
				fieldLabel: 'Please submit your Github API Key to see issues for your repos',
				fieldType: 'text',
				fieldError:  '',
				disabled: false,
		        required: false,
		        rows: 2,
		        bottomSpacing: '1rem'
			});
	  	});

	  	 it('renders submit Button with expected props', () => {
	    	expect(wrapper.find('Button')).toHaveLength(1);
			expect(wrapper.find('Button').props()).toEqual({
				type: 'submit',
				buttonText: 'Submit',
				disabled: true,
				color: '#d62027',
				colorAlt: null,
				iconOnRight: false,
				className: 'btn',
				hidden: false,
				minWidth: '175px'
			});
	  	});
	});

	describe('Updates fieldValue state', () => {
		it('disables submit button on load when form input field is empty', () => {
			expect(wrapper.find('#save-key').prop('value')).toEqual('');
			expect(wrapper.find('Button').prop('disabled')).toBe(true);
		});

		it('enables submit button when form input field has text', () => {
			// act(() => { 
			// 	wrapper.find('#save-key').props().onChange({target: {
			// 	   value: '1234567900'
			// 	}});
			// });

			expect(wrapper.find('#save-key').props().value).toEqual('');

			act(() => { 
				wrapper.find('#save-key').instance().value = '1234567900';
	        	wrapper.find('#save-key').simulate('change');
        	});

		    wrapper.update();

			expect(wrapper.find('#save-key').props().value).toEqual('1234567900');
			expect(wrapper.find('Button').prop('disabled')).toBe(false);
		});

		it('should call the dispatch function and disable the submit button on form submit', () => {
			const dispatch = jest.fn();

			wrapper = mount(
				<Provider store={store}>
					<SaveKey dispatch={dispatch} />
				</Provider>
			);

			expect(wrapper.find('#save-key').props().value).toEqual('');
			expect(wrapper.find('Button').prop('disabled')).toBe(true);

			act(() => { 
				wrapper.find('#save-key').instance().value = '1234567900';
	        	wrapper.find('#save-key').simulate('change');
        	});

        	wrapper.update();

			expect(wrapper.find('#save-key').props().value).toEqual('1234567900');
        	expect(wrapper.find('Button').prop('disabled')).toBe(false);

        	act(() => { 
	        	wrapper.find('#save-key').simulate('submit');
        	});
			
			wrapper.update();

			const expectedParams = {"key": "1234567900", "type": "SAVE_KEY"};

			expect(wrapper.find('Button').prop('disabled')).toBe(true);
			expect(dispatch).toHaveBeenCalledWith(expectedParams);
		});
	});
});