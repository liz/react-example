import React from 'react';
import PropTypes from 'prop-types';

export const FormInputRequired = (props) => {
    if (props.required && !props.fieldError) {
        return <p className="required">* Required</p>;
    }

    return null;
}

FormInputRequired.defaultProps = {
    required: false,
    fieldError: ''
};

FormInputRequired.propTypes = {
    /** Is this field required? */
    required: PropTypes.bool, 
    /** Is there a fieldError supplied? */
    fieldError: PropTypes.string,
};