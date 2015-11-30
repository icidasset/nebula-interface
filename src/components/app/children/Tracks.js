import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import * as trackUtils from '../../../utils/tracks';
import styles from './Tracks.pcss';


class Tracks extends Component {

  trackClickHandler(event) {
    const idx = parseInt(event.target.closest('li').getAttribute('rel'), 10);
    const track = this.props.tracks.filteredItems[idx];

    if (this.props.queue.activeItem === track) {
      this.props.actions.setAudioIsPlaying(true);
    } else {
      this.props.actions.injectIntoQueue(track);
    }
  }


  render() {
    const listItems = [];
    const trackClickHandler = this.trackClickHandler.bind(this);
    const activeTrackId = this.props.queue.activeItem ?
      trackUtils.generateTrackId(this.props.queue.activeItem) :
      false;

    this.props.tracks.filteredItemIds.forEach((trackId, idx) => {
      const styleName = `track ${trackId === activeTrackId ? 'is-active' : ''}`;
      const track = this.props.tracks.filteredItems[idx];

      listItems.push(<li
        key={idx}
        styleName={styleName}
        onDoubleClick={trackClickHandler}
        rel={idx}
      >
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
  queue: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default CSSModules(Tracks, styles, { allowMultiple: true });
