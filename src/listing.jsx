import React, { Component } from 'react';
import styled from 'styled-components';

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

export class Listing extends Component {
	render() {
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