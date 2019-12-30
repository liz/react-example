import React from 'react';
import { mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { act } from 'react-dom/test-utils';

import Octokit from '@octokit/rest';
import nock from 'nock';

// import { SaveKey } from './save-key';
import IssueListing from './issue-listing';
import theme from './theme';
import SmallArrow from './components/small-arrow';

const mockStore = configureMockStore();
const store = mockStore({});

describe('IssueListing', () => {
	let selectedRepo;
	let issues;
	let apiKey = '1234567900';
	let wrapper;
	let scope;
	let octokit;
	//repos/liz/react-example/issues

	beforeEach( () => {
	    selectedRepo = {
    		id: 332626,
    		name: 'example-repo',
    		created_at: "2009-10-09T22:32:41Z",
			updated_at: "2013-11-30T13:46:22Z",
			owner: {
				login: "liz"
			}
	    };

	    issues = [
	    	{ 
	    		assignee: {
		    		avatar_url: 'http://path/to/avatar.png',
		    		login: 'asignee-login'
		    	},
		    	title: "An issue title that is more than twenty-five characters",
		    	name: 'example-repo',
	    		created_at: "2009-10-09T22:32:41Z",
				updated_at: "2013-11-30T13:46:22Z"
			},
			{ 
	    		assignee: {
		    		avatar_url: 'http://path/to/bob/avatar.png',
		    		login: 'bob-login'
		    	},
		    	title: "Bob is another issue that is more than twenty-five characters",
		    	name: 'another example repo',
	    		created_at: "2015-10-09T22:32:41Z",
				updated_at: "2017-11-30T13:46:22Z"
			},
	    ];
    });

    afterEach(() => {
		nock.cleanAll();
    });

    describe('componentDidUpdate', () => {
    	let fetchIssuesSpy;

    	beforeEach(() => {
    		fetchIssuesSpy = jest.spyOn(IssueListing.prototype, 'fetchIssues').mockImplementation();
			
			wrapper = mount(
				<Provider store={store}>
					<IssueListing selectedRepo={null} />
				</Provider>
			);

			wrapper.update();

			expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(null);
	  		expect(wrapper.find('IssueListing').state().isLoaded).toEqual(null);

			wrapper.setProps({ children: <IssueListing selectedRepo={selectedRepo} /> });

	  		wrapper.update();
    	});

	   	afterEach(() => {
	        jest.restoreAllMocks();
	    });

    	it('calls fetchIssues() on componentDidUpdate when selectedRepo prevProp is different then selectedRepo prop', () => {

			expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(selectedRepo);
			expect(fetchIssuesSpy).toHaveBeenCalled();
	  	});

	  	it('sets isLoaded state to false componentDidUpdate when selectedRepo prevProp is different then selectedRepo prop', () => {

			expect(wrapper.find('IssueListing').state().isLoaded).toEqual(false);
			expect(fetchIssuesSpy).toHaveBeenCalled();
	  	});
    });

	describe('Renders', () => {
		it('should match the snapshot', () => {
			wrapper = mount(
				<Provider store={store}>
					<IssueListing selectedRepo={selectedRepo} />
				</Provider>
			);

			wrapper.update();

	    	expect(wrapper.html()).toMatchSnapshot();
	  	});

	  	describe('Renders when github responds with github data', () => {
			it('renders Table', async () => {
				nock.disableNetConnect();
			  	scope = nock('https://api.github.com')
			  	.persist()
			    .get(`/repos/${selectedRepo.owner.login}/${selectedRepo.name}/issues`)
			    .reply(200, issues);

				octokit = new Octokit({
		            auth: apiKey
		        });
				
				wrapper = mount(
					<Provider store={store}>
						<IssueListing selectedRepo={null} />
					</Provider>
				);

				wrapper.update();

				expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(null);

				wrapper.setProps({ children: <IssueListing selectedRepo={selectedRepo} /> });

				await octokit.request(`/repos/${selectedRepo.owner.login}/${selectedRepo.name}/issues`);
		  		scope.done();

		  		wrapper.update();

				expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(selectedRepo);
		  		expect(wrapper.find('IssueListing').state().isLoaded).toBe(true);
		  		expect(wrapper.find('IssueListing').state().issues).toEqual(expect.arrayContaining(issues));
		  		expect(wrapper.find('IssueListing').find('Table')).toHaveLength(1);
		  		nock.cleanAll();
			});
		});

		it('renders NoRepoSelected when isLoaded state is null', () => {
	  		const fetchIssuesSpy = jest.spyOn(IssueListing.prototype, 'fetchIssues').mockImplementation();

			wrapper = mount(
				<Provider store={store}>
					<IssueListing selectedRepo={selectedRepo} />
				</Provider>
			);
			
			wrapper.update();

	    	expect(wrapper.find('IssueListing').state().isLoaded).toBe(null);
	    	expect(wrapper.find('IssueListing').find('NoRepoSelected')).toHaveLength(1);
	    	jest.restoreAllMocks();
	  	});

	});
});