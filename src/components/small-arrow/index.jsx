import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import theme from '../../theme';

const SmallArrowContainer = styled.span`
	height: 0;
	width: 0;
	border-left: ${(props) => props.width} solid transparent;
	border-right: ${(props) => props.width} solid transparent;

	&.asc {
		border-bottom: ${(props) => props.width} solid ${(props) => props.color};
	}

	&.desc {
		border-top: ${(props) => props.width} solid ${(props) => props.color};
	}

	&.open {
		border-bottom: ${(props) => props.width} solid ${(props) => props.color};
		transform: rotate(180deg);
		transition-duration: 0.3s;
	}

	&.close {
		border-bottom: ${(props) => props.width} solid ${(props) => props.color};
		transform: rotate(90deg);
		transition-duration: 0.3s;
	}
`;
SmallArrowContainer.displayName = 'SmallArrowContainer';

const SmallArrow = (props) => {
	return (
		<SmallArrowContainer 
			className={props.className} 
			width={props.width}
			color={props.color}
		/>
	);
}

SmallArrow.defaultProps = {
	color: theme.primaryColor,
	width: '5px'
}

SmallArrow.propTypes = {
    /** A CSS color code. */
    color: PropTypes.string,
    /** Width of arrow */
    width: PropTypes.string,
    /** Class name. */
    className: PropTypes.string
};

export default SmallArrow