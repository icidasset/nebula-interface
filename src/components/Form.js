import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Form.scss';


@CSSModules(styles)
export default class Form extends Component {

  render() {
    return (
      <form styleName="form">
        {this.props.children}
      </form>
    );
  }

}
