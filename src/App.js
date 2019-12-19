
import React, { Component } from 'react';
import styled from 'styled-components';
import MediaQueries from './media-queries';
import Octokit from '@octokit/rest';

const Container = styled.div`
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;
Container.displayName = 'Container';

const Row = styled.div`
    display: flex;
`;
Row.displayName = 'Row';

const ColA = styled.div`
    width: 100%;

        @media (min-width: ${MediaQueries.min.medium}) {
            width: 33.3333%;
            max-width: 33.3333%;
            min-width: 33.3333%;

        }
`;
ColA.displayName = 'ColA';

const ColB = styled.div`
    width: 100%;

        @media (min-width: ${MediaQueries.min.medium}) {
            width: 66.6667%;
            max-width: 66.6667%;
            min-width: 66.6667%;

        }
`;
ColB.displayName = 'ColB';

export default class App extends Component {

    componentDidMount() {
        const octokit = new Octokit({
            auth: ""
        });

        octokit.repos.list({})
            .then(({ data }) => {
                console.log(data);
            });
    }

    render() {
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
}