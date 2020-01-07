import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import theme from '../../theme';

const Shell = styled.div`
    max-width: ${(props) => props.maxWidth};
    margin-left: auto;
    margin-right: auto;
    padding-top: ${(props) => props.verticalPadding};
    padding-bottom: ${(props) => props.verticalPadding};
    padding-left: ${(props) => props.horizontalPadding};
    padding-right: ${(props) => props.horizontalPadding};
`;
Shell.displayName = 'Shell';

export const Container = (props) => (
    <Shell
    	maxWidth={props.maxWidth}
    	horizontalPadding={props.horizontalPadding}
    	verticalPadding={props.verticalPadding}
    	className={props.className}
    >
    	{props.children}
    </Shell>
);

Container.defaultProps = {
	maxWidth: theme.container,
	horizontalPadding: theme.gutter,
	verticalPadding: null
}

Container.propTypes = {
    /** Max width of the container */
    maxWidth: PropTypes.string,
    /** Horizontal padding of the container */
    horizontalPadding: PropTypes.string,
    /** Vertical  padding of the container */
    verticalPadding: PropTypes.string,
    /** Class name. */
    className: PropTypes.string
};