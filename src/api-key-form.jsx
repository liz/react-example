import React, { Component } from 'react';
// import Octokit from '@octokit/rest';

import { Container } from './components/container';

export class ApiKeyForm extends Component {
	constructor(props) {
        super(props);

        this.state = {
            apiKey: ''
        };
    }

	handleChange = (event) => {
        console.log("HELLO handleChange")
        this.setState({
            apiKey: event.target.value
        });
        console.log("logged event.target.value: " + event.target.value)
        console.log("logged state: " + this.state.apiKey)
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("HELLO handleSubmit")
        alert('A name was submitted: ' + this.state.apiKey);
    };


	render() {
		if (!this.props.apiKey) {
            return (
                <Container>
                	{console.log("form if")}
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <input type="text" value={this.state.apiKey} onChange={this.handleChange} />
                            <input type="submit" value="Submit API Key" />
                        </fieldset>
                    </form>
                </Container>
            );
        } else {
        	return console.log("form else")
        }

        // return null;
	}
}