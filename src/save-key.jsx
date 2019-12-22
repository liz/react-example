import React from 'react';
import styled from 'styled-components/macro';
import { connect } from 'react-redux'

import { saveKey } from './actions'

import theme from './theme';

import { Container } from './components/container';
import { Row } from './components/row';
import { Button } from './components/button';

const Col = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};
`;
Col.displayName = 'Col';

const SaveKey = ({ dispatch }, props) => {
    let input

    return (
        <Container>
            <Row breakPoint={props.breakPoint}>
                <Col>
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
                            <Row>
                                <Col>
                                    <input ref={node => (input = node)} />
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