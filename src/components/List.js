import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './List.pcss';


class List extends Component {

  render() {
    const actions = this.props.actions.map((action) => {
      return (
        <a key={action.key} title={action.label} onClick={action.clickHandler}>
          <i className="material-icons">{action.icon}</i>
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

          <i className="material-icons">{this.props.emptyIcon}</i>
          <span>{this.props.emptyMessage}</span>

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
  items: PropTypes.array,
  onClick: PropTypes.func,
};


List.defaultProps = {
  actions: [],
  items: [],
};


export default CSSModules(List, styles);
