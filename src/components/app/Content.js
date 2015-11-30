import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Content.pcss';


class Content extends Component {

  render() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }

}


Content.propTypes = {
  children: PropTypes.node.isRequired,
};


export default CSSModules(Content, styles);
