import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Icon from './Icon';
import styles from './List.pcss';


class List extends Component {

  render() {
    const actions = this.props.actions.map((action) => {
      return (
        <a key={action.key} title={action.label} onClick={action.clickHandler}>
          <Icon icon={action.icon} />
        </a>
      );
    });

    const items = this.props.items.map((item, idx) => {
      return (
        <li styleName="item" key={item.key || idx} data-key={item.key}>
          <div styleName="item__title">{item.title}</div>
          <div styleName="item__actions">{actions}</div>
        </li>
      );
    });

    if (items.length) {
      return (<ol styleName="list">{items}</ol>);
    }

    return (
      <div styleName="empty-state" onClick={this.props.emptyClickHandler}>
        <div styleName="empty-state__inner">

          <Icon icon={this.props.emptyIcon} />
          <span styleName="empty-state__message">{this.props.emptyMessage}</span>
          <span styleName="empty-state__note">{this.props.emptyNote}</span>

        </div>
      </div>
    );
  }

}


List.propTypes = {
  actions: PropTypes.array,
  emptyClickHandler: PropTypes.func,
  emptyIcon: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  emptyNote: PropTypes.string,
  items: PropTypes.array,
  onClick: PropTypes.func,
};


List.defaultProps = {
  actions: [],
  items: [],
};


export default CSSModules(List, styles);
