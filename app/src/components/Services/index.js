import React, { useState } from 'react';

import Icon from '../Icon';
import IconApps from '../../assets/icons/apps.svg';

export default ({ list = [] }) => {
  const [isOpen, changeOpen] = useState(false);
  return (
    <div className="menu__services--container">
      <div
        className="menu__link menu__link--icon"
        tabIndex="0"
        role="button"
        data-popup="apps"
        onClick={() => changeOpen(!isOpen)}
      >
        <Icon size="sm" src={IconApps} alt="Services" />
      </div>

      <div
        className={['menu__services--list', !isOpen ? 'hidden' : ''].join(' ')}
      >
        {list.map(v => (
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={v.homeUrl}
            key={v.key}
          >
            {v.iconUrl ? <img src={v.iconUrl} alt={v.name} /> : v.name}
          </a>
        ))}
      </div>
    </div>
  );
};
