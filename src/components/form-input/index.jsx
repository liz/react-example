import React from 'react';

export const FormInput = (props) => {
	const onChange = (event) => {
        if (props.fieldChange) {
            props.fieldChange(event);
        }
    };

	const onKeyPress = (event) => {
        if (props.onKeyPress) {
            props.onKeyPress(event);
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
	   	<Field
			id={props.fieldId}
			type={props.fieldType}
			name={props.fieldId}
			value={props.value}
			placeholder={props.placeHolder}
	        onChange={(event) => onChange(event)}
	        required={props.required}
	        disabled={props.disabled}
	        onKeyPress={onKeyPress}
	        rows={props.rows}
		>
			{props.children}
		</Field>
    );
}

FormInput.defaultProps = {
	fieldId: 'input',
	fieldType: 'text',
	disabled: false,
	required: false,
	rows: 2
}