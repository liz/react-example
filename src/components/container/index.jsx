import React, { Component } from 'react';
import styled from 'styled-components/macro';

import theme from '../../theme';

const Shell = styled.div`
    max-width: ${theme.container};
    margin-left: auto;
    margin-right: auto;
`;
Shell.displayName = 'Shell';

export class Container extends Component {
	render() {
		return (
			<Shell>{this.props.children}</Shell>
		);
	}
}