import React, { useState, useEffect } from 'react';
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

const SaveKey = ({ dispatch }) => {
    const [fieldValue, setFieldValue] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(saveKey(fieldValue))
    }; 

    useEffect(() => {
        if (fieldValue) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [fieldValue]);

    const onFieldChange = (event) => {
        setFieldValue(event.target.value)
    }; 

    return (
        <Container>
            <Row>
                <Col>
                    <form
                        onSubmit={(event) => onSubmit(event)}
                    >
                        <fieldset>
                            <Row>
                                <Col>
                                    <FormInput
                                        value={fieldValue}
                                        fieldChange={event => onFieldChange(event)} 
                                        placeHolder="Github API Key"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button 
                                        type="submit"
                                        buttonText="Submit"
                                        disabled={buttonDisabled}
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

export default connect()(SaveKey)