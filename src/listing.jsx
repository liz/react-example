import React, { Component } from 'react';
import styled from 'styled-components';
import Octokit from '@octokit/rest';

import mediaQueries from './media-queries';

import { Container } from './components/container';

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
            repos: ''
        };
    }

    componentDidMount() {
        const octokit = new Octokit({
            auth: "eed7e39f1b240f6014560075954213e6d7baa93b"
        });

        octokit.repos.list({})
            .then(({ data }) => {
                this.setState({
                    repos: data
                });
            });
    }

	render() {
        // console.log(keys)
        console.log(this.props)
		if (this.props.apiKey) {
            return (
                <Container>
                    <Row>
                        <ColA>
                            <h2>Repos</h2>
                        </ColA>
                        <ColB>
                            <h2>Issue</h2>
                        </ColB>
                    </Row>
                </Container>
            );
        }

        return null;
	}
}

// export default Listing;