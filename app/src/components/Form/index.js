import React from 'react';

import './Form.css';

export const FormGroup = ({children, ...rest}) => (
    <form className="form__group" {...rest}>{children}</form>
)

export const FormLabel = ({children, ...rest}) => (
    <label className="form__label" {...rest}>{children}</label>
)

export const FormControl = ({element, children, ...rest}) => (
    <div></div>
)

export const FormLine = ({element, children, ...rest}) => (
    <div></div>
)
