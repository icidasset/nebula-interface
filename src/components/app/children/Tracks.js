import { createElement, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactListView from 'react-list-view';

import * as trackUtils from '../../../utils/tracks';

import Icon from '../../Icon';
import List from '../../List';
import Middle from '../../Middle';

import contentStyles from '../Content.pcss';
import styles from './Tracks.pcss';


class Tracks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rowHeight: 25,
      tracksContainerHeight: 0,
    };

    this.boundHandleResize = this.handleResize.bind(this);
  }


  componentDidMount() {
    window.addEventListener('resize', this.boundHandleResize);

    this.setSpaceProperties();
    this.detectRowHeight();
  }


  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = (
      (nextProps.tracks.filteredItemIds !== this.props.tracks.filteredItemIds) ||
      (nextProps.queue.activeItem !== this.props.queue.activeItem)
    );

    const stateChanged = (
      (nextState.rowHeight !== this.state.rowHeight) ||
      (nextState.tracksContainerHeight !== this.state.tracksContainerHeight)
    );

    return propsChanged || stateChanged;
  }


  componentDidUpdate() {
    this.detectRowHeight();
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.boundHandleResize);
  }


  /// Space properties
  ///
  setSpaceProperties() {
    const node = ReactDOM.findDOMNode(this);
    const mainNode = node.closest(`.${contentStyles.main}`);
    const filterNode = node.querySelector(`.${styles.filter}`);

    this.setState({
      tracksContainerHeight: (
        mainNode.clientHeight - (
          filterNode ? filterNode.clientHeight : 0
        )
      ),
    });
  }


  detectRowHeight() {
    const node = ReactDOM.findDOMNode(this);
    const trackNode = node.querySelector(`.${styles.track}`);

    if (trackNode) {
      this.setState({ rowHeight: trackNode.offsetHeight });
    }
  }


  /// Events
  ///
  handleResize() {
    this.setSpaceProperties();
    this.detectRowHeight();
  }


  handleTracksWrapperDoubleClick(event) {
    const target = event.target.closest('.ReactListView');
    const tracksNode = target.querySelector(`.${styles.tracks}`);

    const scrollOffset = -(target.scrollTop % this.state.rowHeight);
    const b = target.getBoundingClientRect();
    const y = event.pageY - b.top - scrollOffset;
    const n = Math.ceil(y / this.state.rowHeight);

    const idxOffset = parseInt(tracksNode.getAttribute('data-y'), 10);
    const idx = idxOffset + n - 1;

    event.preventDefault();

    // get track and play it
    const track = this.props.tracks.filteredItems[idx];

    if (this.props.queue.activeItem !== track) {
      this.props.actions.injectIntoQueue(track);
    }

    this.props.actions.setAudioIsPlaying(true);
  }


  handleFilterChange(event) {
    this.props.actions.filterTracks(event.target.value);
  }


  /// Render
  ///
  renderItems(startIdx, endIdx, activeTrackId) {
    if (endIdx === -1) {
      return (<div></div>);
    }

    // render
    return this.props.tracks.filteredItemIds.slice(startIdx, endIdx).map((trackId, tempIdx) => {
      const idx = startIdx + tempIdx;
      const track = this.props.tracks.filteredItems[idx];
      let className = styles.track;

      if (trackId === activeTrackId) {
        className = className + ' ' + styles['is-active'];
      }

      return (<div
        key={idx}
        className={className}
        rel={idx}
      >
        <div>{track.properties.title}</div>
        <div>{track.properties.artist}</div>
        <div>{track.properties.album}</div>
      </div>);
    });
  }


  render() {
    const activeTrackId = this.props.queue.activeItem ?
      trackUtils.generateTrackId(this.props.queue.activeItem) :
      false;

    const amountOfVisibleRows = Math.ceil(
      this.state.tracksContainerHeight / this.state.rowHeight
    ) + 1;

    if (this.props.tracks.items.length === 0) {
      return (
        <Middle>
          <List
            items={[]}
            emptyIcon="beamed-note"
            emptyMessage="No tracks found."
            emptyNote="Click to add a source."
            emptyClickHandler={() => this.props.actions.goTo('/app/sources/add')}
          />
        </Middle>
      );
    }

    return (
      <div>

        <div className={styles.filter}>
          <Icon icon="magnifying-glass" />
          <input
            type="text"
            placeholder="Search"
            value={this.props.tracks.filter}
            onChange={this.handleFilterChange.bind(this)}
          />
        </div>

        <div
          onDoubleClick={this.handleTracksWrapperDoubleClick.bind(this)}
          onMouseDown={(event) => event.preventDefault()}
        >
          <ReactListView
            style={{ height: this.state.tracksContainerHeight }}
            rowCount={this.props.tracks.filteredItemIds.length}
            rowHeight={this.state.rowHeight}
            renderItem={(x, y, style) => {
              const listItems = this.renderItems(
                Math.abs(y),
                y + amountOfVisibleRows,
                activeTrackId
              );

              return (<div
                className={styles.tracks}
                style={style}
                data-y={y}
              >{listItems}</div>);
            }}
          />
        </div>

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
