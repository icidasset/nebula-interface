import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Icon from './Icon';

import styles from './Message.pcss';


class Message extends Component {

  render() {
    let icon;

    if (this.props.icon) {
      icon = (<Icon icon={this.props.icon} />);
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
};


export default CSSModules(Message, styles);
