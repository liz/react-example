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
import SmallArrow from './components/small-arrow';

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

	  	it('renders LoadingSpinner when isLoaded state is false', () => {
	  		const fetchReposSpy = jest.spyOn(Listing.prototype, 'fetchRepos');
			const wrapper = mount(
				<Provider store={store}>
					<Listing apiKey={apiKey} />
				</Provider>
			);

			wrapper.update();

	    	expect(wrapper.find('Listing').state().isLoaded).toBe(false);
	    	expect(wrapper.find('Listing').find('LoadingSpinner')).toHaveLength(1);
	  	});

	  	describe('Renders when github responds with github data', () => {
	  		let wrapper;
	  		beforeEach(async () => {
		  		const octokit = new Octokit({
		            auth: apiKey
		        });
			  	const scope = nock('https://api.github.com')
			  	.persist()
			    .get('/user/repos')
			    .reply(200, repos);

			  	wrapper = mount(
					<Provider store={store}>
						<Listing apiKey={apiKey} />
					</Provider>
				);

			  	await octokit.request('/user/repos');
				scope.done();
				wrapper.update();
	  		});

	  		afterEach(() => {
				nock.cleanAll();
			});

			it('renders ListingContainer', async () => {
			  	expect(wrapper.find('Listing').state().isLoaded).toBe(true);
			  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
			  	expect(wrapper.find('ListingContainer')).toHaveLength(1);
			});

			it('renders RepoList', async () => {
			  	expect(wrapper.find('Listing').state().isLoaded).toBe(true);
			  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
			  	expect(wrapper.find('RepoList')).toHaveLength(1);
			});

			it('renders IssueListing with expected props when repo is selected and sets the repoAccordionOpen state to false', async () => {
				expect(wrapper.find('Listing').state().isLoaded).toBe(true);
			  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
			  	expect(wrapper.find('Listing').state().selectedRepo).toEqual(null);
			  	expect(wrapper.find('Listing').state().repoAccordionOpen).toBe(true);
			  	expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(true);
			  	expect(wrapper.find('SelectRepoButton')).toHaveLength(2);

				wrapper.find('SelectRepoButton').at(0).simulate('click');

				wrapper.update();

				expect(wrapper.find('Listing').state().selectedRepo).toEqual(0);
				expect(wrapper.find('Listing').state().repoAccordionOpen).toBe(false);
				expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(false);
			  	expect(wrapper.find('IssueListing')).toHaveLength(1);
			  	expect(wrapper.find('IssueListing').props()).toEqual({
			  		"className": "repo-selected",
			  		"selectedRepo": repos[0]
				});
			});

			it('renders RepoAccordion with expected className when repoToggle is clicked', async () => {
				expect(wrapper.find('Listing').state().isLoaded).toBe(true);
			  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
			  	expect(wrapper.find('RepoAccordion')).toHaveLength(1);

			  	expect(wrapper.find('RepoToggle')).toHaveLength(1);
			  	expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(true);

				wrapper.find('RepoToggle').simulate('click');
				wrapper.update();

				expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(false);
			});

			it('renders RepoAccordion with expected className when repoToggle is clicked twice in a row', async () => {
				expect(wrapper.find('Listing').state().isLoaded).toBe(true);
			  	expect(wrapper.find('Listing').state().repos).toEqual(repos);
			  	expect(wrapper.find('RepoAccordion')).toHaveLength(1);

			  	expect(wrapper.find('RepoToggle')).toHaveLength(1);
			  	expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(true);

				wrapper.find('RepoToggle').simulate('click');
				wrapper.update();

				expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(false);

				wrapper.find('RepoToggle').simulate('click');
				wrapper.update();

				expect(wrapper.find('RepoAccordion').hasClass('slidedown')).toBe(true);
			});
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
});