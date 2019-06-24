import React from 'react';
import { Menu, MenuLink, MenuText } from '../Menu';

import './Header.css';

import Icon from '../Icon';
import IconApps from '../../assets/icons/apps.svg';
import IconScissors from '../../assets/icons/scissors.svg'

export default () => (
  <header className="header wrapper">
      <Menu className="header__nav">
          <MenuLink modifer="icon" to="/">
              <Icon size="md" src={IconScissors} alt="Trimmer logo"/>
              <MenuText>Home</MenuText>
          </MenuLink>
          <MenuLink to="/history">
              History
          </MenuLink>
          <MenuLink to="/add">
              Slice stream
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
