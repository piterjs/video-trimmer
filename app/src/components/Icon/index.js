import React from 'react';
import classNames from 'classnames';

import './Icon.css';

export default ({src, alt, size}) => {
    const classes = classNames(
        {'icon': true},
        {
            'icon--sm': size === 'sm',
            'icon--md': size === 'md',
            'icon--lg': size === 'lg',
        },
    )

    return <img src={src} alt={alt} className={classes}/>
};
