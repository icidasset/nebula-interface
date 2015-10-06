import React, { Component } from 'react';

import styles from './header.scss';


export default class Header extends Component {

  render() {
    return (
      <header className={styles.header}>
        <h1>Header</h1>
      </header>
    );
  }

}
