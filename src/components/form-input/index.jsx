import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { FormInputError } from './error';
import { FormInputRequired } from './required';

const FieldContainer = styled.div`
    margin-bottom: ${(props) => props.bottomSpacing};
`;
FieldContainer.displayName = 'FieldContainer';

export const FormInput = (props) => {
	const onChange = (event) => {
	    if (props.fieldChange) {
	        props.fieldChange(event);
	    }
	};

	let Field = 'input';

	if (props.fieldType === 'select') {
	    Field = 'select';
	}

	if (props.fieldType === 'textarea') {
	    Field = 'textarea';
	}

	return (
		<FieldContainer 
		className={props.className}
		bottomSpacing={props.bottomSpacing}
		>
			<label htmlFor={props.fieldId}>
				{props.fieldLabel}
			</label>
			<Field
				id={props.fieldId}
				type={props.fieldType}
				name={props.fieldId}
				value={props.value}	
				placeholder={props.placeHolder}
			    onChange={(event) => onChange(event)}
			    disabled={props.disabled}
			    rows={props.rows}
			>
				{props.children}
			</Field>
			<FormInputRequired 
				fieldError={props.fieldError}
				required={props.required}
			/>
			<FormInputError fieldError={props.fieldError} />
		</FieldContainer>
	);
}

FormInput.defaultProps = {
	fieldId: 'input',
	fieldType: 'text',
	disabled: false,
	required: false,
	rows: 2,
	bottomSpacing: '1rem'
}

FormInput.propTypes = {
    /** Id # for input */
    fieldId: PropTypes.string,
    /** Type of input */
    fieldType: PropTypes.string,
    /** Should this input be disabled? */
    disabled: PropTypes.bool,
    /** Should this input be required? */
    required: PropTypes.bool,
    /** How many rows should a textarea element have? */
    rows: PropTypes.number,
    /** Bottom spacing under input */
    bottomSpacing: PropTypes.string,
    /** Class name. */
    className: PropTypes.string
};