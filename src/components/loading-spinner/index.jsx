import React from 'react';
import styled from 'styled-components/macro';

import loading from '../../images/loading.gif';

import { Image } from '../image';

const LoadingContainer = styled.div`
    margin: auto;
`;

export const LoadingSpinner = (props) => (
    <LoadingContainer>
    	<Image src={loading} alt="Loading..." width={props.width} />
    </LoadingContainer>
);

LoadingSpinner.defaultProps = {
	width: "25px"
}