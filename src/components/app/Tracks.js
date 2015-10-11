import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Tracks.scss';


@CSSModules(styles)
export default class Tracks extends Component {

  render() {
    let listItems = [];

    for (let i = 0, j = 250; i < j; i++) {
      listItems.push(<li key={i} styleName="track">
        <strong>Delicious (Vocal Mix)</strong>
        <span> by </span>
        <strong>Alexander Kowalski & Raz Ohara</strong>
      </li>)
    }

    return (
      <ul styleName="tracks">
        {listItems}
      </ul>
    );
  }

}
