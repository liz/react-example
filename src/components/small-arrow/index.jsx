import React from 'react';
import styled from 'styled-components/macro';

import theme from '../../theme';

const SmallArrowContainer = styled.span`
	height: 0;
	width: 0;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;

	&.asc {
		border-bottom: 5px solid ${(props) => props.color};
	}

	&.desc {
		border-top: 5px solid ${(props) => props.color};
	}

    &.open {
    	border-bottom: 5px solid ${(props) => props.color};
        transform: rotate(180deg);
    	transition-duration: 0.3s;
    }

    &.close {
       border-bottom: 5px solid ${(props) => props.color};
       transform: rotate(90deg);
       transition-duration: 0.3s;
    }
`;
SmallArrowContainer.displayName = 'SmallArrowContainer';

const SmallArrow = (props) => {
	return (
		<SmallArrowContainer 
			className={props.className} 
			color={props.color}
		/>
	);
}

SmallArrow.defaultProps = {
	color: theme.primaryColor
}

export default SmallArrow