import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Message.scss';


@CSSModules(styles)
class Message extends Component {

  render() {
    const icon = this.props.icon ?
      (<span styleName="icon">{this.props.icon}</span>) :
      (<span />);

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


export default Message;
