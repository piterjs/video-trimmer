import React, { useState, useEffect } from 'react';
import { Menu, MenuLink, MenuText } from '../Menu';

import './Header.css';

import Services from '../Services';

import Icon from '../Icon';
import IconScissors from '../../assets/icons/scissors.svg';

export default () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getInfo = async () => {
      const res = await fetch('/api/me');
      if (res.status === 200) {
        const json = await res.json();
        setUser(json);
      }
    };
    getInfo();
  }, []);
  return (
    <header className="header wrapper">
      <Menu className="header__nav">
        <MenuLink modifer="icon" to="/">
          <Icon size="md" src={IconScissors} alt="Trimmer logo" />
          <MenuText>Home</MenuText>
        </MenuLink>
        <MenuLink to="/history">History</MenuLink>
        <MenuLink to="/add">Slice stream</MenuLink>
      </Menu>
      <Menu className="header__tray">
        {user && <Services list={user.services} />}
        {user && !user.youtube && (
          <MenuLink to="/youtube/auth">Youtube auth</MenuLink>
        )}
        <MenuLink modifer="icon" to="/">
          {user && user.avatar && (
            <Icon
              size="md"
              src={user.avatar.url}
              style={{ marginRight: '5px' }}
              alt="avatar"
            />
          )}
          {user && user.name}
        </MenuLink>
      </Menu>
    </header>
  );
};
