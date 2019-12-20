import React, { Component } from 'react';

// import styled from 'styled-components';
// import MediaQueries from './media-queries';
// import Octokit from '@octokit/rest';

// import ApiKeyForm from './api-key-form';

import SaveKey from './save-key';
// import ConnectedListing from './connected-listing';
import Listing from './listing';

import './App.scss';

// const Container = styled.div`
//     max-width: 1200px;
//     margin-left: auto;
//     margin-right: auto;
// `;
// Container.displayName = 'Container';



export default class App extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         apiKey: ''
    //     };
    // }

    // componentDidMount() {
    //     const octokit = new Octokit({
    //         auth: ""
    //     });

    //     octokit.repos.list({})
    //         .then(({ data }) => {
    //             console.log(data);
    //         });
    // }

    // renderListing = () => {
    //     if (this.state.apiKey) {
    //         return (
    //             <Container>
    //                 <Row>
    //                     <ColA>
    //                         <h2>Repos</h2>
    //                     </ColA>
    //                     <ColB>
    //                         <h2>Issue</h2>
    //                     </ColB>
    //                 </Row>
    //             </Container>
    //         );
    //     }

    //     return null;
    // };

    // renderForm = () => {
    //     if (!this.state.apiKey) {
    //         return (
    //             <Container>
    //                 <form onSubmit={this.handleSubmit}>
    //                     <fieldset>
    //                         <input type="text" value={this.state.apiKey} onChange={this.handleChange} />
    //                         <input type="submit" value="Submit API Key" />
    //                     </fieldset>
    //                 </form>
    //             </Container>
    //         );
    //     }

    //     return null;
    // };

    // handleChange = (event) => {
    //     console.log("HELLO handleChange")
        // this.setState({
        //     apiKey: event.target.value
        // });
    //     console.log("logged event.target.value: " + event.target.value)
    //     console.log("logged state: " + this.state.apiKey)
    // };

    // handleSubmit = (event) => {
    //     event.preventDefault();
    //     console.log("HELLO handleSubmit")
    //     alert('A name was submitted: ' + this.state.apiKey);
    // };

    // render() {
    //     // if (this.state.apiKey) {
    //     //    return <ConnectedListing apiKey={this.props.apiKey} />;
    //     // }

    //     return (
    //         <div>
    //             <SaveKey apiKey={this.props.apiKey} />
    //             <ConnectedListing apiKey={this.props.apiKey} />
    //         </div>
    //     );
       
    // }

    render() {
        console.log(this.props.apiKey[0])
        if (this.props.apiKey && this.props.apiKey.length) {
           return <Listing apiKey={this.props.apiKey[0].key} />;
        }

        return (
            <SaveKey />
        );
       
    }
}