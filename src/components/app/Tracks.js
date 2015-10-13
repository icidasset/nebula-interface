import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Tracks.scss';


@CSSModules(styles)
export default class Tracks extends Component {

  render() {
    let listItems = [];

    this.props.tracks.items.forEach(function(track, idx) {
      listItems.push(<li key={idx} styleName="track">
        <strong>{track.title}</strong>
        <span> by </span>
        <strong>{track.artist}</strong>
      </li>);
    });

    return (
      <ul styleName="tracks">
        {listItems}
      </ul>
    );
  }

}
