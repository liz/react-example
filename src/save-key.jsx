import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { connect } from 'react-redux'

import { saveKey } from './actions';

import theme from './theme';

import { Container } from './components/container';
import { Row } from './components/row';
import { FormInput } from './components/form-input';
import { Button } from './components/button';

const Col = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};
    text-align: center;
`;
Col.displayName = 'Col';

const SaveKey = ({ dispatch }, props) => {
    const [value, setValue] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(saveKey(value))
    }; 

    return (
        <Container>
            <Row breakPoint={props.breakPoint}>
                <Col>
                    <form
                        onSubmit={(event) => onSubmit(event)}
                    >
                        <fieldset>
                            <Row>
                                <Col>
                                    <FormInput
                                        value={value}
                                        fieldChange={e => setValue(e.target.value)} 
                                    />
                                </Col>
                            </Row>
                            <Row breakPoint={props.breakPoint}>
                                <Col>
                                    <Button 
                                        type="submit"
                                        buttonText="Submit ApiKey"
                                    />
                                </Col>
                            </Row>
                        </fieldset>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

SaveKey.defaultProps = {
    breakPoint: null
}

export default connect()(SaveKey)