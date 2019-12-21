import React, { Component } from 'react';

import SaveKey from './save-key';
import Listing from './listing';

export default class App extends Component {
    render() {
        if (this.props.apiKey && this.props.apiKey.length) {
           return <Listing apiKey={this.props.apiKey[0].key} />;
        }

        return (
            <SaveKey />
        );
       
    }
}