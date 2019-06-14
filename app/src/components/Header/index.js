import React from 'react';
import { Menu, MenuLink, MenuText } from '../Menu';

import './Header.css';

import Icon from '../Icon';
import IconApps from '../../assets/apps.svg';
import IconScissors from '../../assets/scissors.svg'

export default () => (
  <header className="header">
      <Menu className="header__nav">
          <MenuLink modifer="icon" to="/">
              <Icon size="md" src={IconScissors} alt="Trimmer logo"/>
              <MenuText>History</MenuText>
          </MenuLink>
          <MenuLink to="/add">
              Add new
          </MenuLink>
      </Menu>
      <Menu className="header__tray">
          <div className="menu__link menu__link--icon" tabIndex="0" role="button" data-popup="apps">
              <Icon size="sm" src={IconApps} alt="Trimmer logo"/>
          </div>
          <MenuLink modifer="icon" to="/">
              <Icon size="md" src="https://placekitten.com/32/32" alt="avatar"/>
          </MenuLink>
      </Menu>
  </header>
);
