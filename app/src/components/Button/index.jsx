import React from 'react';

import './Button.css';
import './colors/default.css';
import './colors/primary.css';
import './colors/secondary.css';

import '../Control/Control.css';
import '../Control/sizes.css';

// TODO: add text button
// TODO: add outlined button
// TODO: add icon-button
// TODO: add button-with-icon (left, right)
// TODO: add pressed state for button
// TODO: add rounded button

function Button ({size = 'normal', color = 'default', tag = 'button', className = '', ...rest}) {
    const classes = [
        'Control',
        `Control--size-${size}`,
        'Button',
        `Button--color-${color}`,
        className
    ].join(' ').trim()

    const Tag = `${tag}`;

    return <Tag
        className={classes}
        {...rest}
    >{rest.children}</Tag>
}

export default Button;
