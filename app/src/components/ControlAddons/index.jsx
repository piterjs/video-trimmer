import React from 'react';
import './ControlAddons.css';
import './sizes.css';

function ControlAddons ({size = 'normal', color = 'default', tag = 'button', className = '', ...rest}) {
    const classes = [
        'Control-addons',
        `Control-addons--size-${size}`,
        className
    ].join(' ').trim()

    return <div
        role="group"
        className={classes}
        {...rest}
    >{rest.children}</div>
}

export default ControlAddons;
