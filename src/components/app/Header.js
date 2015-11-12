import { createElement, Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Header.pcss';


class Header extends Component {

  render() {
    return (
      <header styleName="header"></header>
    );
  }

}


export default CSSModules(Header, styles);
