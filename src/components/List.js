import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './List.scss';


@CSSModules(styles)
class List extends Component {

  render() {
    const items = this.props.items.map((item, idx) => {
      return (
        <li styleName="item" key={idx}>
          <div styleName="item__title">{item.title}</div>
          <div styleName="item__actions">{item.actions}</div>
        </li>
      );
    });

    if (items.length) {
      return (<ol styleName="list" onClick={this.props.onClick}>{items}</ol>);
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
  emptyClickHandler: PropTypes.func.isRequired,
  emptyIcon: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};


export default List;
