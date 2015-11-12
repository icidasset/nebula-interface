import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './ContentWithMenu.pcss';


class ContentWithMenu extends Component {

  render() {
    return (
      <section styleName="layout">

        <nav>
          <h1>{this.props.title}</h1>
          {this.props.menuItems}
        </nav>

        <div styleName="content">
          {this.props.children}
        </div>

      </section>
    );
  }

}


ContentWithMenu.propTypes = {
  children: PropTypes.node.isRequired,
  menuItems: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};


export default CSSModules(ContentWithMenu, styles);
