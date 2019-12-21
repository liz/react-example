import React from 'react';

import loading from '../../images/loading.gif';

import { Image } from '../image';

export const LoadingSpinner = (props) => (
    <Image src={loading} alt="Loading..." width={props.width} />
);

LoadingSpinner.defaultProps = {
	width: "25px"
}