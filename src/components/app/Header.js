import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Header.scss';


@CSSModules(styles)
export default class Header extends Component {

  render() {
    return (
      <header styleName="header"></header>
    );
  }

}
