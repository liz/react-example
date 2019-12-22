import React from 'react';
import styled from 'styled-components/macro';

import theme from '../../theme';
import mediaQueries from '../../media-queries';

const RowContainer = styled.div`
    margin-left: -${theme.gutter};
    margin-right: -${theme.gutter};

    @media (min-width: ${(props) => props.breakPoint}) {
        display: flex;
    }
`;
RowContainer.displayName = 'RowContainer';

export const Row = (props) => (
    <RowContainer breakPoint={props.breakPoint}>
    	{props.children}
    </RowContainer>
);

Row.defaultProps = {
	breakPoint: mediaQueries.min.medium
}