import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Middle.scss';


@CSSModules(styles)
class Middle extends Component {

  render() {
    return (
      <div styleName="middle">
        {this.props.children}
      </div>
    );
  }

}


Middle.propTypes = {
  children: PropTypes.node,
};


export default Middle;
