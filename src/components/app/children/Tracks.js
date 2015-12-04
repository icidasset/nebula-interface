import { createElement, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactListView from 'react-list-view';

import * as trackUtils from '../../../utils/tracks';
import Icon from '../../Icon';
import contentStyles from '../Content.pcss';
import styles from './Tracks.pcss';


class Tracks extends Component {

  constructor(props) {
    super(props);

    this.rowHeight = 25;
    this.state = { tracksContainerHeight: 0 };
  }


  componentDidMount() {
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.boundHandleResize);

    this.setSpaceProperties();
    this.detectRowHeight();
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.boundHandleResize);
  }


  setSpaceProperties() {
    const node = ReactDOM.findDOMNode(this);
    const mainNode = node.closest(`.${contentStyles.main}`);
    const filterNode = node.querySelector(`.${styles.filter}`);

    this.setState({
      tracksContainerHeight: mainNode.clientHeight - filterNode.clientHeight,
    });
  }


  detectRowHeight() {
    const node = ReactDOM.findDOMNode(this);
    const trackNode = node.querySelector(`.${styles.track}`);

    if (trackNode) {
      this.rowHeight = trackNode.offsetHeight;
    }
  }


  handleResize() {
    this.setSpaceProperties();
    this.detectRowHeight();
  }


  handleTrackClick(event) {
    const idx = parseInt(event.target.closest(`.${styles.track}`).getAttribute('rel'), 10);
    const track = this.props.tracks.filteredItems[idx];

    if (this.props.queue.activeItem !== track) {
      this.props.actions.injectIntoQueue(track);
    }

    this.props.actions.setAudioIsPlaying(true);
  }


  handleFilterChange(event) {
    this.props.actions.filterTracks(event.target.value);
  }


  render() {
    const listItems = [];
    const activeTrackId = this.props.queue.activeItem ?
      trackUtils.generateTrackId(this.props.queue.activeItem) :
      false;

    const trackClickHandler = this.handleTrackClick.bind(this);
    const filterChangeHandler = this.handleFilterChange.bind(this);

    this.props.tracks.filteredItemIds.forEach((trackId, idx) => {
      const track = this.props.tracks.filteredItems[idx];
      let className = styles.track;

      if (trackId === activeTrackId) {
        className = className + ' ' + styles['is-active'];
      }

      listItems.push(<div
        key={idx}
        className={className}
        onDoubleClick={trackClickHandler}
        rel={idx}
      >
        <div>{track.properties.title}</div>
        <div>{track.properties.artist}</div>
        <div>{track.properties.album}</div>
      </div>);
    });

    const amountOfVisibleRows = Math.ceil(
      this.state.tracksContainerHeight / this.rowHeight
    );

    return (
      <div>

        <div className={styles.filter}>
          <Icon icon="magnifying-glass" />
          <input
            type="text"
            placeholder="Search"
            value={this.props.tracks.filter}
            onChange={filterChangeHandler}
          />
        </div>

        <ReactListView
          style={{
            height: this.state.tracksContainerHeight,
          }}
          rowCount={listItems.length}
          rowHeight={this.rowHeight}
          renderItem={(x, y, style) => {
            const _listItems = listItems.slice(
              Math.abs(y),
              y + amountOfVisibleRows
            );

            return (<div className={styles.tracks} style={style}>{_listItems}</div>);
          }}
        />

      </div>
    );
  }

}


Tracks.propTypes = {
  actions: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default Tracks;
