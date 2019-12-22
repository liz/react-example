import React, { Component } from 'react';
import styled from 'styled-components/macro';

import theme from '../../theme';

const Shell = styled.div`
    max-width: ${theme.container};
    margin-left: auto;
    margin-right: auto;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};
`;
Shell.displayName = 'Shell';

export class Container extends Component {
	render() {
		return (
			<Shell>{this.props.children}</Shell>
		);
	}
}