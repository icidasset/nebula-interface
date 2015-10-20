import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Middle.scss';


@CSSModules(styles)
export default class Middle extends Component {

  render() {
    return (
      <div styleName="middle">
        {this.props.children}
      </div>
    );
  }

}
