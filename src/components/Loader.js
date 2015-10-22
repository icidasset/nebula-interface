import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Loader.scss';


@CSSModules(styles)
class Loader extends Component {

  render() {
    return (
      <div styleName="loader">
        <div className="circles-loader">
          Loading…
        </div>
      </div>
    );
  }

}


export default Loader;
