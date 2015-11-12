import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Tracks.scss';


class Tracks extends Component {

  render() {
    const listItems = [];

    this.props.tracks.filteredItems.forEach((track, idx) => {
      listItems.push(<li key={idx} styleName="track">
        <strong>{track.properties.title}</strong>
        <span> by </span>
        <strong>{track.properties.artist}</strong>
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


export default CSSModules(Tracks, styles);
