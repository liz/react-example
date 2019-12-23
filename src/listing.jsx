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

const ColBNoPaddingMobile = styled.div`
    width: 100%;

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 66.6667%;
            padding-left: ${theme.gutter};
            padding-right: ${theme.gutter};
        }
`;
ColBNoPaddingMobile.displayName = 'ColBNoPaddingMobile';

const ColBNoPadding = styled.div`
    width: 100%;

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 66.6667%;
        }
`;
ColBNoPadding.displayName = 'ColBNoPadding';

const FullWidthCol = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};

    &.slideup, &.slidedown {
        @media (min-width: ${mediaQueries.min.medium}) {
            max-height: 100%;
        }
    }

    *[class*='listing__RepoToggle'] *[class*='button__Icon'] {
        @media (min-width: ${mediaQueries.min.medium}) {
            display: none;
        }
    }
`;
FullWidthCol.displayName = 'FullWidthCol';

const RepoToggle = styled(Button)`
    font-weight: normal;
    font-size: ${theme.xlargeBaseFont};

    *[class*='button__Text'] {
        padding: 0;
    }
`;
RepoToggle.displayName = 'RepoToggle';

// const SelectRepoButton = styled(Button)`
//     padding: 5px 10px;

//     &.repo-selected {
//         background: ${theme.backgroundAlt};
//         border: 1px solid ${theme.primaryColor};

//         &:hover {
//             background: transparent;
//             border: 0;
//         }
//     }
// `;
// SelectRepoButton.displayName = 'SelectRepoButton';

const SelectRepoButton = styled(Button)`
    &.repo-selected {
        text-decoration: underline;
        color: ${theme.black};

        *[class*='small-arrow__SmallArrowContainer'] {
             border-bottom-color: ${theme.black};
        }
        
        &:hover {
            color: ${theme.primaryColor};

            *[class*='small-arrow__SmallArrowContainer'] {
                border-bottom-color: ${theme.primaryColor};
            }
        }
    }
`;
SelectRepoButton.displayName = 'SelectRepoButton';

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
                        <SelectRepoButton 
                            buttonText={repo.name} 
                            handleClick={() => this.selectRepo(index)}
                            className={`btn btn--link ${this.state.selectedRepo === index? 'repo-selected' : ''}`}
                            icon={<SmallArrow className={this.state.selectedRepo === index ? 'close' : ''}></SmallArrow>}
                            iconOnRight
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
                                            icon={<SmallArrow className={this.state.repoAccordionOpen ? 'open' : 'close'} color={theme.black} width="7px"></SmallArrow>}
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
                        <ColBNoPadding>
                            <IssueListing 
                                className={this.state.repos && this.state.repos[this.state.selectedRepo] ? 'repo-selected' : 'no-repo-selected'}
                                selectedRepo={this.state.repos && this.state.repos[this.state.selectedRepo]}
                            />
                        </ColBNoPadding>
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