import React from 'react';
import { connect } from 'react-redux'

import { saveKey } from './actions'

import { Container } from './components/container';

const SaveKey = ({ dispatch }) => {
    let input

    return (
        <Container>
            <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!input.value.trim()) {
                    return
                  }
                  dispatch(saveKey(input.value))
                  input.value = ''
                }}
            >
                <fieldset>
                    <input ref={node => (input = node)} />
                    <button type="submit">Submit ApiKey</button>
                </fieldset>
            </form>
        </Container>
    );
}

export default connect()(SaveKey)