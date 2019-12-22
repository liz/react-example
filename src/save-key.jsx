import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { connect } from 'react-redux'

import { saveKey } from './actions';

import theme from './theme';
import mediaQueries from './media-queries';

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

const OuterCol = styled(Col)`
    max-width: ${mediaQueries.min.iphone6};
    margin: auto;
`;
OuterCol.displayName = 'OuterCol';

const SaveKey = (props) => {
    const [fieldValue, setFieldValue] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    // const [fieldError, setFieldError] = useState('');
    // const [fieldError, setFieldError] = useState('');
    const [fieldError, setFieldError] = useState(...props.fieldError);

    // useEffect(() => {
    //     if (fieldValue) {
    //         setButtonDisabled(false)
    //     } else {
    //         setButtonDisabled(true)
    //     }

    //     setFieldError(props.fieldError);
    // }, [fieldValue], [setFieldError], props.fieldError);

    useEffect(() => {
        setFieldError(props.fieldError);

        if (fieldValue || fieldError) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [props.fieldError, fieldValue, fieldError]);

    const onSubmit = (event) => {
        event.preventDefault();
        console.log(fieldValue)
        if (fieldValue) {
            console.log("should dispatch")
            props.dispatch(saveKey(fieldValue))
        } else {
            setFieldError("Please enter an API Key")
        }
    }; 

    const onFieldChange = (event) => {
        setFieldValue(event.target.value);
    }; 

    return (
        <Container>
            <Row>
                <OuterCol>
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
                                        fieldError={fieldError}
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
                </OuterCol>
            </Row>
        </Container>
    );
}

SaveKey.defaultProps = {
    fieldError: '',
};

export default connect()(SaveKey)