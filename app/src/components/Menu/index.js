import React from 'react';

import { NavLink } from 'react-router-dom';

import './Menu.css';

export const MenuLink = ({to = '/', modifer = '', children}) => {
    let classes = `menu__link`

    if(modifer) {
        classes += ` menu__link--${modifer}`
    }

    return <NavLink className={classes} to={to} exact activeClassName="menu__link--active">
        {children}
    </NavLink>
};

export const Menu = ({children}) => (
    <div className="menu">{children}</div>
);
