import { createElement, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactListView from 'react-list-view';

import * as trackUtils from '../../../utils/tracks';

import contentStyles from '../Content.pcss';
import styles from './Tracks.pcss';


class Tracks extends Component {

  constructor(props) {
    super(props);

    this.rowHeight = 25;
    this.state = { mainContentHeight: 0 };
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

    this.setState({
      mainContentHeight: mainNode.clientHeight,
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

    if (this.props.queue.activeItem === track) {
      this.props.actions.setAudioIsPlaying(true);
    } else {
      this.props.actions.injectIntoQueue(track);
    }
  }


  render() {
    const listItems = [];
    const trackClickHandler = this.handleTrackClick.bind(this);
    const activeTrackId = this.props.queue.activeItem ?
      trackUtils.generateTrackId(this.props.queue.activeItem) :
      false;

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
        <strong>{track.properties.title}</strong>
        <span> by </span>
        <strong>{track.properties.artist}</strong>
      </div>);
    });

    const amountOfVisibleRows = Math.ceil(
      this.state.mainContentHeight / this.rowHeight
    );

    return (
      <ReactListView
        style={{
          height: this.state.mainContentHeight,
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
    );
  }

}


Tracks.propTypes = {
  actions: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default Tracks;
