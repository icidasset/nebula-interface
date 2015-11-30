import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Header.pcss';


class Boxes extends Component {

  render() {
    return (
      <div></div>
    );
  }

}


Boxes.propTypes = {
  actions: PropTypes.object.isRequired,
};


export default CSSModules(Boxes, styles);
