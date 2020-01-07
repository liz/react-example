import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import theme from '../../theme';
import mediaQueries from '../../media-queries';

const RowContainer = styled.div`
    margin-left: -${theme.gutter};
    margin-right: -${theme.gutter};
    height:  ${(props) => props.height};

    @media (min-width: ${(props) => props.breakPoint}) {
        display: flex;
    }
`;
RowContainer.displayName = 'RowContainer';

export const Row = (props) => (
    <RowContainer 
    	breakPoint={props.breakPoint}
    	height={props.height}
    >
    	{props.children}
    </RowContainer>
);

Row.defaultProps = {
	breakPoint: mediaQueries.min.medium,
	height: null
}

Row.propTypes = {
    /** Window width to stop stacking elements */
    breakPoint: PropTypes.string,
    /** Height of conainer */
    height: PropTypes.string,
    /** Child elements */
    children: PropTypes.node
};
