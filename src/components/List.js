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

    return (<ol styleName="list">{items}</ol>);
  }

}


List.propTypes = {
  items: PropTypes.array.isRequired,
};


export default List;
