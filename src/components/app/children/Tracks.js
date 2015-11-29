import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Tracks.pcss';


class Tracks extends Component {

  render() {
    const listItems = [];
    const clickHandler = (event) => {
      const idx = parseInt(event.target.closest('li').getAttribute('rel'), 10);
      const track = this.props.tracks.filteredItems[idx];

      this.props.actions.injectIntoQueue(track);
    };

    this.props.tracks.filteredItems.forEach((track, idx) => {
      listItems.push(<li key={idx} styleName="track" onDoubleClick={clickHandler} rel={idx}>
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
  actions: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default CSSModules(Tracks, styles);
