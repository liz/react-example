import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Octokit from '@octokit/rest';

import theme from './theme';
import mediaQueries from './media-queries';

import { Container } from './components/container';
import { Row } from './components/row';
import { LoadingSpinner } from './components/loading-spinner';
import { Button } from './components/button';
import SmallArrow from './components/small-arrow';

import IssueListing from './issue-listing';
import SaveKey from './save-key';

const ColA = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 33.3333%;
        }
`;
ColA.displayName = 'ColA';

const ColB = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 66.6667%;
        }
`;
ColB.displayName = 'ColB';

const FullWidthCol = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};
`;
FullWidthCol.displayName = 'FullWidthCol';

const RepoToggle = styled(Button)`
    font-weight: normal;
    font-size: ${theme.xlargeBaseFont};

    *[class|='button__Text'] { {
        padding: 0;
    }
`;
RepoToggle.displayName = 'RepoToggle';

export default class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRepo: null,
            repos: '',
            isLoaded: false,
            repoAccordionOpen: true
        };
    }

    fetchRepos = () => {
        const octokit = new Octokit({
            auth: this.props.apiKey
        });

        octokit.repos.list({})
            .then(({ data }) => {
                this.setState({
                    repos: data,
                    isLoaded: true
                });
            }).catch(err => {
                this.setState({
                    repos: [],
                    isLoaded: true,
                    fieldError: "Github does not recognize this API Key, please try a different API Key."
                });
            });;
    };

    componentDidMount() {
        if (this.props.apiKey) {
            this.fetchRepos();
        }
    };

    componentDidUpdate(prevProps) {
        console.log(prevProps.apiKey)
        if (prevProps.apiKey !== this.props.apiKey) {
            console.log("prevProps check ran")
            if (this.props.apiKey) {
                // this.setState({ isLoaded: false });
                this.fetchRepos();
            }
        }
    }

    selectRepo = (index) => {
        this.setState({ selectedRepo: index });
        this.setRepoAccordion(false);
    };

    setRepoAccordion = (state) => {
        this.setState({ repoAccordionOpen: state });
    };

    toggleRepoAccordion = () => {
        this.setState({ repoAccordionOpen: !this.state.repoAccordionOpen });
    };

    renderRepoList = () => {
        if (this.state.isLoaded && this.state.repos && this.state.repos.length) {
            const repoList = this.state.repos.map((repo, index) => (
                <li key={index}>
                    <p>
                        <Button 
                            buttonText={repo.name} 
                            handleClick={() => this.selectRepo(index)}
                            className="btn btn--link"
                        />
                    </p>
                </li>
            ));

            return <ul>{repoList}</ul>;
        }

        return <LoadingSpinner />;
    };

	render() {
		if (this.state.isLoaded && this.state.repos && this.state.repos.length) {
            return (
                <Container>
                    <Row>
                        <ColA>
                            <Row>
                                <FullWidthCol>
                                    <h2>
                                        <RepoToggle 
                                            handleClick={this.toggleRepoAccordion}  
                                            buttonText="Select a Repo"
                                            iconOnRight
                                            className="btn btn--link"
                                            icon={<SmallArrow className={this.state.repoAccordionOpen ? 'open' : 'close'}></SmallArrow>}
                                            color={theme.black}
                                        />
                                    </h2>
                                </FullWidthCol>
                            </Row>
                            <Row>
                                <FullWidthCol className={this.state.repoAccordionOpen ? 'slidedown' : 'slideup'}>
                                    {this.renderRepoList()}
                                </FullWidthCol>
                            </Row>
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

        return <SaveKey fieldError={this.state.fieldError} />;

        // return null;
	}
}

Listing.defaultProps = {
    selectedRepoId: null,
    selectedRepoOwner: null
};

// export default Listing;