import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Tracks.scss';


@CSSModules(styles)
class Tracks extends Component {

  render() {
    const listItems = [];

    this.props.tracks.items.forEach((track, idx) => {
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


Tracks.propTypes = {
  tracks: PropTypes.object.isRequired,
};


export default Tracks;
