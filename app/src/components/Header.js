import React from 'react';

import { Link } from 'react-router-dom';

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'row'
  },
  link: {
    marginRight: '10px',
    fontSize: '18px'
  }
};

export default () => (
  <div style={styles.header}>
    <Link style={styles.link} to="/">
      History
    </Link>
    <Link style={styles.link} to="/add">
      Add new
    </Link>
  </div>
);
