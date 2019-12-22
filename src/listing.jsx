import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Octokit from '@octokit/rest';

import theme from './theme';
import mediaQueries from './media-queries';

import { Container } from './components/container';
import { LoadingSpinner } from './components/loading-spinner';

import IssueListing from './issue-listing';

const Row = styled.div`
    margin-left: -${theme.gutter};
    margin-right: -${theme.gutter};

    @media (min-width: ${mediaQueries.min.medium}) {
        display: flex;
    }
`;
Row.displayName = 'Row';

const ColA = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 33.3333%;
            max-width: 33.3333%;
            min-width: 33.3333%;

        }
`;
ColA.displayName = 'ColA';

const ColB = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 66.6667%;
            max-width: 66.6667%;
            min-width: 66.6667%;

        }
`;
ColB.displayName = 'ColB';

export default class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRepo: null,
            repos: '',
            isLoaded: false
        };
    }

    componentDidMount() {
        const octokit = new Octokit({
            auth: this.props.apiKey
        });

        octokit.repos.list({})
            .then(({ data }) => {
                this.setState({
                    repos: data,
                    isLoaded: true
                });
            });

        // octokit.users.getAuthenticated().then(({ data }) => {
        //         this.setState({
        //             user: data
        //         });
        //         console.log(data)
        //     });
    }

    selectRepo = (index) => {
        this.setState({ selectedRepo: index });
    };

    renderRepoList = () => {
        if (this.state.isLoaded && this.state.repos && this.state.repos.length) {
            const repoList = this.state.repos.map((repo, index) => (
                <li key={index} >
                    <button title={repo.name} aria-label={repo.name} onClick={() => this.selectRepo(index)}>{repo.name}</button>
                </li>
            ));

            return repoList;
        }

        return <LoadingSpinner />;
    };

	render() {
		if (this.props.apiKey) {
            return (
                <Container>
                    <Row>
                        <ColA>
                            <h2>Repos</h2>
                            {this.renderRepoList()}
                        </ColA>
                        <ColB>
                            <h2>Issue</h2>
                            <IssueListing 
                                selectedRepoName={this.state.repos && this.state.repos[this.state.selectedRepo] && this.state.repos[this.state.selectedRepo].name} 
                                selectedRepoOwner={this.state.repos && this.state.repos[this.state.selectedRepo] && this.state.repos[this.state.selectedRepo].owner && this.state.repos[this.state.selectedRepo].owner.login} 
                            />
                        </ColB>
                    </Row>
                </Container>
            );
        }

        return null;
	}
}

Listing.defaultProps = {
    selectedRepoId: null,
    selectedRepoOwner: null
};

// export default Listing;