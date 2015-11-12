import { createElement, Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Mixer.pcss';


class Mixer extends Component {

  render() {
    return (<div styleName="mixer"></div>);
  }

}


export default CSSModules(Mixer, styles);
