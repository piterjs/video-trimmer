import React from 'react';

import './Icon.css';

// TODO: inline svg icons

function Icon ({src, alt, size, ...rest}) {
    const classes = [
        'Icon',
        `Icon--${size}`,
    ].join(' ').trim()

    return <img
        src={src}
        alt={alt}
        className={classes}
        {...rest}
    />
}

export default Icon;
