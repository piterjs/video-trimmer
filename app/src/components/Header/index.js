import React from 'react';
import { Menu, MenuLink } from '../Menu';

import './Header.css';

import Icon from '../Icon';
import IconApps from '../../assets/apps.svg';
import IconScissors from '../../assets/scissors.svg'

export default () => (
  <header className="header">
      <nav className="header__nav">
          <Menu>
              <MenuLink modifer="icon" to="/">
                  <Icon size="md" src={IconScissors} alt="Trimmer logo"/>
              </MenuLink>
              <MenuLink to="/">
                  History
              </MenuLink>
              <MenuLink to="/add">
                  Add new
              </MenuLink>
          </Menu>
      </nav>
      <div className="header__tray">
          <Menu>
              <div className="menu__link menu__link--icon menu__item--apps" tabIndex="0" role="button" data-popup="apps">
                  <Icon size="sm" src={IconApps} alt="Trimmer logo"/>
              </div>
              <MenuLink modifer="icon" to="/">
                  <Icon size="md" src="https://placekitten.com/32/32" alt="avatar"/>
              </MenuLink>
          </Menu>
      </div>
  </header>
);
