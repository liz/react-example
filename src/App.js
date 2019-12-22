import React, { Component } from 'react';

import SaveKey from './save-key';
import Listing from './listing';

export default class App extends Component {
    render() {
        if (this.props.apiKey && this.props.apiKey.key) {
           return <Listing apiKey={this.props.apiKey.key} />;
        }

        return (
            <SaveKey />
        );
       
    }
}