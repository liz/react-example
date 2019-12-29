import React from 'react';
import { mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { act } from 'react-dom/test-utils';

import Octokit from '@octokit/rest';
import nock from 'nock';

import { SaveKey } from './save-key';
import Listing from './listing';
import theme from './theme';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Listing', () => {
	let apiKey = '1234567900';
	let repos;

	beforeEach(() => {

	    repos = [
	    	{
	    		id: 332626,
	    		created_at: "2009-10-09T22:32:41Z",
				updated_at: "2013-11-30T13:46:22Z",
				owner: {
					login: "bob"
				}
	    	},
	    	{
	    		id: 432627,
	    		created_at: "2018-10-09T22:32:41Z",
				updated_at: "2019-11-30T13:46:22Z",
				owner: {
					login: "jim"
				}
	    	}
	    ];
    });

	afterEach(() => {
		nock.cleanAll();
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
    	it('calls fetchRepos() on componentDidMount', () => {
		  	const fetchReposSpy = jest.spyOn(Listing.prototype, 'fetchRepos');
			const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey={apiKey} />
				</Provider>
			);
			expect(fetchReposSpy).toHaveBeenCalled();
	  	});
    });

    describe('componentDidUpdate', () => {
    	it('calls fetchRepos() on componentDidUpdate when apiKey prevProp is different then apiKey prop', () => {
		  	const fetchReposSpy = jest.spyOn(Listing.prototype, 'fetchRepos');
			const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey="anythingelse" />
				</Provider>
			);

			wrapper.update();

			expect(wrapper.find('Listing').props().apiKey).toEqual("anythingelse");
			expect(fetchReposSpy).toHaveBeenCalled();

			wrapper.setProps({ children: <Listing apiKey={apiKey} /> });

			wrapper.update();

			expect(wrapper.find('Listing').props().apiKey).toEqual(apiKey);
			expect(fetchReposSpy).toHaveBeenCalled();
	  	});
    });

	describe('Renders', () => {
		it('should match the snapshot', () => {
			const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey={apiKey} />
				</Provider>
			);

			wrapper.update();

	    	expect(wrapper.html()).toMatchSnapshot();
	  	});

	  	it('renders ListingContainer when github responds with repo data', async () => {
		  	const octokit = new Octokit({
	            auth: apiKey
	        });
		  	const scope = nock('https://api.github.com')
		  	.persist()
		    .get('/user/repos')
		    .reply(200, repos);

		  	const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey={apiKey} />
				</Provider>
			);

		  	await octokit.request('/user/repos');
			scope.done();

			wrapper.update();

		  	expect(wrapper.find('Listing').state().isLoaded).toBe(true);
		  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
		  	expect(wrapper.find('ListingContainer')).toHaveLength(1);
		});

		it('renders SaveKey with fieldError when github API responds with an error', async () => {
		  	const octokit = new Octokit({});
		  	const scope = nock('https://api.github.com')
		  	.persist()
		    .get('/user/repos')
		    .reply(401, {
			  "message": "Bad credentials",
			  "documentation_url": "https://developer.github.com/v3"
			});

		  	const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey={apiKey} />
				</Provider>
			);

			try {
				await octokit.request('/user/repos');
				scope.done();
			} catch (e) {
				expect(e.status).toEqual(401);
			}

			wrapper.update();

		  	expect(wrapper.find('Listing').state().isLoaded).toBe(true);
		  	expect(wrapper.find('Listing').state().repos).toEqual([]);
		  	expect(wrapper.find('Listing').state().fieldError).toEqual("Github does not recognize this API Key, please try a different API Key.");
		  	expect(wrapper.find(SaveKey)).toHaveLength(1);
		  	expect(wrapper.find(SaveKey).props().fieldError).toEqual("Github does not recognize this API Key, please try a different API Key.");
		});
	 });

	//   	it('renders FormInput with expected props', () => {
	//     	expect(wrapper.find('FormInput')).toHaveLength(1);
	// 		expect(wrapper.find('FormInput').props()).toEqual({
	// 			value: '',
	// 			fieldChange: expect.any(Function),
	// 			placeHolder: 'Github API Key',
	// 			fieldId: 'save-key',
	// 			fieldLabel: 'Please submit your Github API Key to see issues for your repos',
	// 			fieldType: 'text',
	// 			fieldError:  '',
	// 			disabled: false,
	// 	        required: false,
	// 	        rows: 2,
	// 	        bottomSpacing: '1rem'
	// 		});
	//   	});

	//   	 it('renders submit Button with expected props', () => {
	//     	expect(wrapper.find('Button')).toHaveLength(1);
	// 		expect(wrapper.find('Button').props()).toEqual({
	// 			type: 'submit',
	// 			buttonText: 'Submit',
	// 			disabled: true,
	// 			color: '#d62027',
	// 			colorAlt: null,
	// 			iconOnRight: false,
	// 			className: 'btn',
	// 			hidden: false,
	// 			minWidth: '175px'
	// 		});
	//   	});
	// });
});