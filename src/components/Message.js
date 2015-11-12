import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Message.pcss';


class Message extends Component {

  render() {
    let icon;

    if (this.props.icon) {
      if (this.props.isNonMaterialIcon) {
        icon = (<i styleName="icon">{this.props.icon}</i>);
      } else {
        icon = (<i className="material-icons" styleName="icon">{this.props.icon}</i>);
      }
    }

    return (
      <div styleName="message">
        {icon}{this.props.children}
      </div>
    );
  }

}


Message.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string,
  isNonMaterialIcon: PropTypes.bool,
};


export default CSSModules(Message, styles);
