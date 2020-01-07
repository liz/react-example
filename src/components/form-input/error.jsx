import React from 'react';
import PropTypes from 'prop-types';

export const FormInputError = (props) => {
	if (props.fieldError) {
		return <p className="error">{props.fieldError}</p>;
	}

	return null;
}

FormInputError.defaultProps = {
	fieldError: ''
}

FormInputError.propTypes = {
    /** Error response to the FormInput */
    fieldError: PropTypes.string
};