import React, { Component } from 'react';
import styled from 'styled-components';
import Octokit from '@octokit/rest';

import mediaQueries from './media-queries';

import { Container } from './components/container';

import IssueListing from './issue-listing';

const Row = styled.div`
    display: flex;
`;
Row.displayName = 'Row';

const ColA = styled.div`
    width: 100%;

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 33.3333%;
            max-width: 33.3333%;
            min-width: 33.3333%;

        }
`;
ColA.displayName = 'ColA';

const ColB = styled.div`
    width: 100%;

        @media (min-width: ${mediaQueries.min.medium}) {
            width: 66.6667%;
            max-width: 66.6667%;
            min-width: 66.6667%;

        }
`;
ColB.displayName = 'ColB';

// const Listing = ({ keys }) => (
//     <Container>
//         {console.log("keys", keys)}
//         <Row>
//             <ColA>
//                 <h2>Repos</h2>
//                 <p>{keys}</p>
//             </ColA>
//             <ColB>
//                 <h2>Issue</h2>
//             </ColB>
//         </Row>
//     </Container>
// );

// export default Listing;

export default class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRepo: null,
            repos: '',
            user: ''
        };
    }

    componentDidMount() {
        const octokit = new Octokit({
            auth: this.props.apiKey
        });

        octokit.repos.list({})
            .then(({ data }) => {
                this.setState({
                    repos: data
                });
            });

        octokit.users.getAuthenticated().then(({ data }) => {
                this.setState({
                    user: data
                });
                console.log(data)
            });
    }

    selectRepo = (index) => {
        this.setState({ selectedRepo: index });
    };

    renderRepoList = () => {
        const repoList = this.state.repos.map((repo, index) => (
            <li key={index} >
                <button title={repo.name} aria-label={repo.name} onClick={() => this.selectRepo(index)}>{repo.name}</button>
            </li>
        ));

        return repoList;
    };

	render() {
		if (this.props.apiKey) {
            return (
                <Container>
                    <Row>
                        <ColA>
                            <h2>Repos</h2>
                            {this.state.repos && this.state.repos.length && this.renderRepoList()}
                        </ColA>
                        <ColB>
                            <h2>Issue</h2>
                            {console.log(this.state.user)}
                            <IssueListing selectedRepo={this.state.repos[this.state.selectedRepo] && this.state.repos[this.state.selectedRepo].name} user={this.state.user && this.state.user.name} />
                        </ColB>
                    </Row>
                </Container>
            );
        }

        return null;
	}
}

// export default Listing;