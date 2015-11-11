import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Mixer.scss';


@CSSModules(styles)
export default class Mixer extends Component {

  render() {
    return (<div styleName="mixer"></div>);
  }

}
