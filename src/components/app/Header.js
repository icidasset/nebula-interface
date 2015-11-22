import { createElement, Component } from 'react';
import CSSModules from 'react-css-modules';

import Mixer from './Mixer';

import styles from './Header.pcss';


class Header extends Component {

  render() {
    return (
      <header styleName="header">
        <Mixer />
      </header>
    );
  }

}


export default CSSModules(Header, styles);
