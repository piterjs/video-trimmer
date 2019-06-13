import React from 'react';

import './Icon.css';

export default ({src, alt, size}) => {
    let classes = `icon`

    if(size) {
        classes += ` icon--${size}`
    }

    return <img src={src} alt={alt} className={classes}/>
};
