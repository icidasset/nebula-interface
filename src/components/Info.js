import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Icon from './Icon';
import styles from './Info.pcss';


class Info extends Component {

  render() {
    const items = this.props.items.map((item, idx) => {
      let text = item.text;

      if (item.type === 'error') {
        text = text.replace('Error: ', '');
      }

      // icon
      let icon;

      switch (item.type) {
      case 'error':
        icon = 'warning';
        break;
      case 'success':
        icon = 'check';
        break;
      default:
        icon = null;
      }

      if (icon) {
        icon = <Icon icon={icon} />;
      }

      // nodes
      return (
        <li key={idx} data-info-type={item.type}>
          {icon}<span> {text}</span>
        </li>
      );
    });

    // render
    if (items.length) return (<ul styleName="info">{items}</ul>);
  }

}


Info.propTypes = {
  items: PropTypes.array.isRequired,
};


export default CSSModules(Info, styles);
