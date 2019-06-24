import React from 'react';

import './Input.css';
import './states.css';
import './colors/default.css';
import './colors/danger.css';
import './colors/info.css';
import './colors/success.css';
import './colors/warning.css';

import '../Control/Control.css';
import '../Control/sizes.css';

function Input ({size = 'normal', color = 'default', className = '', tag = 'input', ...rest}) {
    const classes = [
        'Control',
        `Control--size-${size}`,
        'Input',
        `Input--color-${color}`,
        className,
    ].join(' ')

    const Tag = `${tag}`;

    return <Tag
        className={classes}
        {...rest}
    />
}

export default Input;
