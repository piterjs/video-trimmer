import React from 'react';

import './Select.css';
import './colors/default.css';
import './colors/danger.css';
import './colors/info.css';
import './colors/success.css';
import './colors/warning.css';

import '../Control/Control.css';
import '../Control/sizes.css';

const Select = ({size = 'normal', color = 'default', className = '', ...rest}) => {
    const classes = [
        'Control',
        `Control--size-${size}`,
        'Select',
        `Select--color-${color}`,
        className
    ].join(' ')

    return <select
        className={classes}
        {...rest}
    >{rest.children}</select>
};

export default Select;
