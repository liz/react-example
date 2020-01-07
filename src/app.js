import React from 'react';
import PropTypes from 'prop-types';

import SaveKey from './save-key';
import Listing from './listing';

const App = (props) => {
    if (props.apiKey && props.apiKey.key) {
       return <Listing apiKey={props.apiKey.key} />;
    }

    return <SaveKey />;
}

App.propTypes = {
	/** Github token provided by the user */
	apiKey: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default App
