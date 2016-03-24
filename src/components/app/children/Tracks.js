import { createElement, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactListView from 'react-list-view';
import Dropdown from 'react-dropdown';

import flatten from 'lodash/array/flatten';
import isObject from 'lodash/lang/isObject';
import sortBy from 'lodash/collection/sortBy';

import * as collectionUtils from '../../../utils/collections';
import * as trackUtils from '../../../utils/tracks';

import Icon from '../../Icon';
import List from '../../List';
import Middle from '../../Middle';

import contentStyles from '../Content.pcss';
import styles from './Tracks.pcss';


const MESSAGES = {
  targetKeys: {
    shift: {
      message: `Double click a track to add it to (or remove it from) the selected collection`,
      level: 'info',
    },
    shiftInCollection: {
      message: `Double click a track to remove it from this collection`,
      level: 'info',
    },
    alt: {
      message: `Double click a track to add it to the queue`,
      level: 'info',
    },
  },
};


class Tracks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rowHeight: 25,
      tracksContainerHeight: 0,

      targetKeys: {
        notificationUids: {
          shift: null,
          alt: null,
        },
      },
    };

    this.boundHandleResize = this.handleResize.bind(this);
  }


  componentWillMount() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);

    document.body.addEventListener('keydown', this.boundHandleKeyDown);
    document.body.addEventListener('keyup', this.boundHandleKeyUp);
  }


  componentDidMount() {
    window.addEventListener('resize', this.boundHandleResize);

    this.setSpaceProperties();
    this.detectRowHeight();
  }


  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = (
      (nextProps.tracks.filteredItemIds !== this.props.tracks.filteredItemIds) ||
      (nextProps.queue.activeItem !== this.props.queue.activeItem) ||
      (nextProps.collections.allTrackIds !== this.props.collections.allTrackIds) ||

      (nextProps.tracks.activeCollection !== this.props.tracks.activeCollection) ||
      (nextProps.tracks.targetCollection !== this.props.tracks.targetCollection)
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
    document.body.removeEventListener('keydown', this.boundHandleKeyDown);
    document.body.removeEventListener('keyup', this.boundHandleKeyUp);
    window.removeEventListener('resize', this.boundHandleResize);
  }


  /**
   * Keyboard events
   */

  handleKeyDown(event) {
    if (this._keyPressed ||
      event.target.tagName === 'TEXTAREA') {
      return;
    }

    this._keyPressed = true;

    if (event.shiftKey || event.altKey) {
      this.state.targetKeys.notificationUids = {
        ...this.state.targetKeys.notificationUids,
        shift: event.shiftKey ?
          this.props.actions.addNotification(
            isObject(this.props.tracks.activeCollection) ?
              MESSAGES.targetKeys.shiftInCollection :
              MESSAGES.targetKeys.shift
          ).notification.uid :
          null,
        alt: event.altKey ?
          this.props.actions.addNotification(MESSAGES.targetKeys.alt).notification.uid :
          null,
      };
    }
  }


  handleKeyUp() {
    this._keyPressed = false;

    if (this.state.targetKeys.notificationUids.shift) {
      this.props.actions.removeNotification(this.state.targetKeys.notificationUids.shift);
      this.state.targetKeys.notificationUids.shift = null;
    }

    if (this.state.targetKeys.notificationUids.alt) {
      this.props.actions.removeNotification(this.state.targetKeys.notificationUids.alt);
      this.state.targetKeys.notificationUids.alt = null;
    }
  }


  /**
   * Space properties
   */

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


  /**
   * Events
   */

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

    // get track
    const track = this.props.tracks.filteredItems[idx];

    // -> action
    if (this.state.targetKeys.notificationUids.shift) {
      if (isObject(this.props.tracks.activeCollection)) {
        this.props.actions.removeTrackFromCollection(track, this.props.tracks.activeCollection);
      } else if (this.props.tracks.targetCollection) {
        const trackIsInCollection = this.props.actions.checkIfTrackIsInCollection(
          track,
          this.props.tracks.targetCollection
        );

        if (trackIsInCollection) {
          this.props.actions.removeTrackFromCollection(track, this.props.tracks.targetCollection);
        } else {
          this.props.actions.addTrackToCollection(track, this.props.tracks.targetCollection);
        }
      } else {
        this.props.actions.addNotification({
          message: `You haven't selected a collection to add something to`,
          level: 'warning',
        });
      }
    } else if (this.state.targetKeys.notificationUids.alt) {
      this.props.actions.injectIntoQueue(track);
      this.props.actions.addNotification({
        message: `Added "${track.properties.title}" to the queue`,
        level: 'success',
      });
    } else {
      if (this.props.queue.activeItem !== track) {
        this.props.actions.injectIntoQueue(track, true);
      }

      this.props.actions.setAudioIsPlaying(true);
    }
  }


  handleFilterChange(event) {
    this.props.actions.filterTracks(event.target.value);
  }


  /**
   * Render
   */

  getTargetCollectionDropdownAttributes() {
    let options;
    let onChange;
    let value;

    const target = this.props.tracks.targetCollection;

    // options
    options = this.props.collections.items.map((col) => {
      const label = target && target.uid === col.uid ?
        <span className="is-active">{col.name}</span> :
        col.name;

      return { value: col.uid, label: label };
    });

    // onChange
    onChange = (option) => {
      let collection;

      if (option) {
        collection = this.props.collections.items.find((col) => {
          return col.uid === option.value;
        });
      }

      this.props.actions.setTargetCollection(collection);
    };

    // value
    value = this.props.tracks.targetCollection;

    if (value) {
      value = {
        value: value.uid,
        label: value.name,
      };
    }

    // @return
    const groupName = (
      <span><strong>Target</strong> collection</span>
    );

    return {
      options: [ { type: 'group', name: groupName, items: options } ],
      onChange,
      value,
    };
  }


  getActiveCollectionDropdownAttributes() {
    let options;
    let onChange;
    let value;

    const active = this.props.tracks.activeCollection;
    const activeIsObject = isObject(active);

    // options
    options = [ { value: null, label: <strong>All</strong> } ];

    options = options.concat(
      sortBy(
        this.props.collections.items.map((col) => {
          return { value: col.uid, label: col.name };
        }),
        'label'
      )
    );

    options = options.concat(
      sortBy(
        flatten(
          collectionUtils.generateSpecialPairs(
            this.props.collections.special
          ).map((s) => {
            return s.map((i) => {
              return {
                value: i[1],
                label: <span><span className="prefix">[ {i[0][0]} ]</span> {i[0][1]}</span>,
              };
            });
          })
        ),
        'label'
      )
    );

    options.forEach((option) => {
      if (!option.value) {
        option.label = (!active ?
          <span className="is-active">{option.label}</span> :
          option.label
        );
      } else if (activeIsObject) {
        option.label = (active && active.uid === option.value ?
          <span className="is-active">{option.label}</span> :
          option.label
        );
      } else {
        option.label = (active === option.value ?
          <span className="is-active">{option.label}</span> :
          option.label
        );
      }
    });

    // onChange
    onChange = (option) => {
      let collection;

      if (option && option.value) {
        if (option.value.indexOf('special:') === 0) {
          collection = option.value;
        } else {
          collection = this.props.collections.items.find((col) => {
            return col.uid === option.value;
          });
        }
      }

      this.props.actions.setActiveCollection(collection);
    };

    // value
    value = this.props.tracks.activeCollection;

    if (value) {
      if (isObject(value)) {
        value = {
          value: value.uid,
          label: value.name,
        };
      } else {
        value = {
          value: value,
          label: value.split(':').slice(2).join(':'),
        };
      }
    }

    // @return
    const groupName = (
      <span><strong>Active</strong> collection</span>
    );

    return {
      options: [ { type: 'group', name: groupName, items: options } ],
      onChange,
      value,
    };
  }


  renderEmptyState() {
    return (
      <Middle>
        <List
          items={[]}
          emptyIcon="beamed-note"
          emptyMessage="No tracks found."
          emptyNote="Click to add a source."
          emptyClickHandler={() => {
            this.props.actions.goTo('/app/sources/add');
          }}
        />
      </Middle>
    );
  }


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
        className = `${className} ${styles['is-active']}`;
      }

      if (this.props.collections.allTrackIds.indexOf(trackId) !== -1) {
        className = `${className} ${styles['is-in-collection']}`;
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
    if (this.props.tracks.items.length === 0) {
      return this.renderEmptyState();
    }

    // collect data
    const activeTrackId = this.props.queue.activeItem ?
      trackUtils.generateTrackId(this.props.queue.activeItem) :
      false;

    const amountOfVisibleRows = Math.ceil(
      this.state.tracksContainerHeight / this.state.rowHeight
    ) + 1;

    const activeCollectionDropdownOptions = this.getActiveCollectionDropdownAttributes();
    const targetCollectionDropdownOptions = this.getTargetCollectionDropdownAttributes();


    // render
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

          <div className={styles.settings}>

            <div className={styles['target-collection']}>
              <div className={styles['target-collection__icon-wrapper']}>
                <Icon icon="copy" />
              </div>
              <Dropdown
                options={targetCollectionDropdownOptions.options}
                onChange={targetCollectionDropdownOptions.onChange}
                value={targetCollectionDropdownOptions.value}
              />
            </div>

            <div className={styles['active-collection']}>
              <Dropdown
                options={activeCollectionDropdownOptions.options}
                onChange={activeCollectionDropdownOptions.onChange}
                value={activeCollectionDropdownOptions.value}
                placeholder="All"
              />
            </div>

          </div>
        </div>

        <div
          onClick={() => {
            if (document.activeElement) {
              document.activeElement.blur();
            }
          }}
          onDoubleClick={this.handleTracksWrapperDoubleClick.bind(this)}
          onMouseDown={(event) => event.preventDefault()}
          className={styles.tracksWrapper}
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
  collections: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default Tracks;
