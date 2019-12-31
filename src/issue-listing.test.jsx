import React from 'react';
import { mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { act } from 'react-dom/test-utils';
import { clearStorage } from "react-simple-storage";

import Octokit from '@octokit/rest';
import nock from 'nock';

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

	beforeEach( () => {
		clearStorage();

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
		    	title: "An issue title that is more than twenty-five characters, this issue was created more recently",
	    		created_at: "2017-10-09T22:32:41Z",
				updated_at: "2019-11-30T13:46:22Z"
			},
			{ 
		    	title: "B is a 25 character title",
	    		created_at: "2009-10-09T22:32:41Z",
				updated_at: "2010-11-30T13:46:22Z"
			},
	    ];
    });

    afterEach(() => {
		nock.cleanAll();
		jest.restoreAllMocks();
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
	  	});

	  	it('renders LoadingSpinner when isLoaded state is false', () => {
	  		const fetchIssuesSpy = jest.spyOn(IssueListing.prototype, 'fetchIssues').mockImplementation();

			wrapper = mount(
				<Provider store={store}>
					<IssueListing selectedRepo={null} />
				</Provider>
			);

			wrapper.update();

			expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(null);

			wrapper.setProps({ children: <IssueListing selectedRepo={selectedRepo} /> });
			
			wrapper.update();

	    	expect(wrapper.find('IssueListing').state().isLoaded).toBe(false);
	    	expect(wrapper.find('IssueListing').find('LoadingSpinner')).toHaveLength(1);
	  	});

	  	describe('Renders when github responds with github data', () => {
	  		beforeEach(async () => {
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

				console.log(wrapper.find('IssueListing').state())

				expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(null);

				wrapper.setProps({ children: <IssueListing selectedRepo={selectedRepo} /> });

				console.log("componentDidUpdate should have gone")

				console.log(wrapper.find('IssueListing').state())

				await octokit.request(`/repos/${selectedRepo.owner.login}/${selectedRepo.name}/issues`);
				console.log("fetch should have gone")
		  		scope.done();
		  		wrapper.update();

		  		console.log(wrapper.find('IssueListing').state())

		  		expect(wrapper.find('IssueListing').props().selectedRepo).toEqual(selectedRepo);
		  		expect(wrapper.find('IssueListing').state().isLoaded).toBe(true);
		  		expect(wrapper.find('IssueListing').state().issues).toEqual(expect.arrayContaining(issues));
		  		console.log(wrapper.find('IssueListing').state())
	  		});

  			afterEach(() => {
				nock.cleanAll();
			});

			it('renders repoName', () => {
		  		expect(wrapper.find('IssueListing').find('h2').text()).toEqual("Issues for example-repo");
			});

			describe('Renders table contents', () => {
				it('renders Table', () => {
			  		expect(wrapper.find('IssueListing').find('Table')).toHaveLength(1);
				});

				it('renders Asignee avatar Image when asignee is supplied', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(0).find('Image').props()).toEqual({
			  				src: issues[0].assignee.avatar_url,
			  				alt: issues[0].assignee.login,
			  				width: "40px",
			  				height: "40px",
			  				horizontalAlignment: "center",
			  				maxHeight: "100%",
			  				maxWidth: "100%",
			  				type: "tag",
			  				verticalAlignment: "center"
			  		});
				});

				it('renders Asignee avatar as "None" when asignee is not supplied', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(2).find('td').at(0).find('Image')).toHaveLength(0);
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(2).find('td').at(0).text()).toContain('None');
				});

				it('truncates title when a title longer then 25 characters is supplied', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(1).text()).toEqual(
			  			'An issue title that is...');
				});

				it('does not truncate title when a title is 25 characters or less', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(2).find('td').at(1).text()).toEqual('B is a 25 character title');
				});

				it('renders created_at date in MM/DD/YYYY format', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(2).text()).toEqual('10/09/2017');
				});

				it('renders updated_at date in text format', () => {
			  		expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(3).text()).toEqual('a month ago');
				});
			});

			describe.only('Table sorting', () => {
				it('sorts table by created_at by default', () => {
					expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(2).text()).toEqual('10/09/2017');
					expect(wrapper.find('IssueListing').state().sort.column).toEqual('created_at');
					console.log(wrapper.find('IssueListing').state())
				});
				
				it('sorts table by desc direction by default', () => {
					expect(wrapper.find('IssueListing').find('Table').find('tr').at(1).find('td').at(2).text()).toEqual('10/09/2017');
					expect(wrapper.find('IssueListing').state().sort.direction).toEqual('desc');
					console.log(wrapper.find('IssueListing').state())
				});
			});

			it('renders MobileSort', () => {
		  		expect(wrapper.find('IssueListing').find('MobileSort')).toHaveLength(1);
			});
		});

		it('renders NoIssuesMessage  when github API responds with an error', async () => {
			nock.cleanAll();
			nock.disableNetConnect();
		  	scope = nock('https://api.github.com')
		  	.persist()
		    .get(`/repos/${selectedRepo.owner.login}/${selectedRepo.name}/issues`)
		    .reply(404, {
			  "message": "Not Found",
			  "documentation_url": "https://developer.github.com/v3/issues/#list-issues-for-a-repository"
			});

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

			try {
				await octokit.request(`/repos/${selectedRepo.owner.login}/${selectedRepo.name}/issues`);
				scope.done();
			} catch (e) {
				expect(e.status).toEqual(404);
			}

			wrapper.update();

		  	expect(wrapper.find('IssueListing').state().isLoaded).toBe(true);
		  	expect(wrapper.find('IssueListing').state().issues).toEqual([]);
		  	expect(wrapper.find('IssueListing').find('NoIssuesMessage')).toHaveLength(1);
		  	nock.cleanAll();
		});
	});
});