import React from 'react';
import classNames from 'classnames';

import { NavLink } from 'react-router-dom';

import './Menu.css';

export const MenuText = ({children}) => (
    <span className="menu__text">{children}</span>
);

export const MenuLink = ({to = '/', modifer = '', direction = 'horizontal', children}) => {
    const classes = classNames(
        {'menu__link': true},
        {'menu__link--active': modifer === 'active'},
        {'menu__link--icon': modifer === 'icon'},
        {
            'menu__link--vertical': direction === 'vertical',
            'menu__link--horizontal': direction === 'horizontal',
        },
    )

    return <NavLink className={classes} to={to} exact activeClassName="menu__link--active">
        {children}
    </NavLink>
};

export const Menu = ({className = '', children}) => (
    <nav className={classNames("menu", className)}>{children}</nav>
);
