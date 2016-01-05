import find from 'lodash/collection/find';
import findWhere from 'lodash/collection/findWhere';
import objGet from 'lodash/object/get';

import * as audioActions from '../../actions/audio';
import * as queueActions from '../../actions/queue';
import * as reduxUtils from '../redux';
import * as sourceUtils from '../sources';
import * as trackUtils from '../tracks';


const actions = Object.assign(
  {},
  audioActions,
  queueActions
);


/// Public
///
export function initialize(store) {
  return new AudioEngine(store);
}


/// Private
///
class AudioEngine {

  constructor(store) {
    this.connections = [];
    this.audioElements = [];
    this.nodes = {};

    // prerequisites
    this.setAudioContext();
    this.createAudioElementsContainer();

    // nodes
    this.createChannelSplitterNode();
    this.createBiquadFilterNodes();
    this.createVolumeNode();

    // store
    this.store = store;
    this.observeStore();
  }


  getNodeValue(nodeKey) {
    const node = objGet(this.nodes, nodeKey);

    // set value
    switch (nodeKey) {
    case 'biquad.low':
    case 'biquad.mid':
    case 'biquad.hi':
    case 'volume':
      return node.gain.value;

    default:
      return node.value;
    }
  }


  setNodeValue(nodeKey, value) {
    const node = objGet(this.nodes, nodeKey);

    // check if node exists
    if (!node) return;

    // check again
    if (this.getNodeValue(nodeKey) === value) return;

    // set value
    switch (nodeKey) {
    case 'biquad.low':
    case 'biquad.mid':
    case 'biquad.hi':
    case 'volume':
      node.gain.value = value || 0;
      break;

    default:
      node.value = value;
    }
  }


  /// External events
  ///
  observeStore() {
    reduxUtils.observeStore(
      this.store,
      (s) => s.queue.activeItem,
      (i) => { if (i) this.insert(i); }
    );

    // audio - isPlaying
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.isPlaying,
      (isPlaying) => {
        const connection = this.getActiveConnection();

        if (connection) {
          if (connection.mediaElement.paused && isPlaying) {
            this.play(connection);
          } else if (!connection.mediaElement.paused && !isPlaying) {
            this.pause(connection);
          }
        }
      }
    );

    // audio - seek
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.seek,
      (p) => {
        const activeConnection = this.getActiveConnection();
        if (activeConnection) this.seek(activeConnection, p);
      }
    );

    // audio - filters
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.filterValues,
      (v) => {
        this.setNodeValue('biquad.low', this.handleFilterValue(v[0]));
        this.setNodeValue('biquad.mid', this.handleFilterValue(v[1]));
        this.setNodeValue('biquad.hi', this.handleFilterValue(v[2]));
      }
    );

    // audio - volume
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.volume,
      (v) => this.setNodeValue('volume', this.store.getState().audio.isMuted ? 0 : v)
    );

    // audio - isMuted
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.isMuted,
      (v) => this.setNodeValue('volume', v ? 0 : this.store.getState().audio.volume)
    );
  }


  handleFilterValue(value) {
    const percentage = Math.abs(value) / this.store.getState().audio.filterValueMax;

    if (value < 0) {
      return -(50 * percentage);
    }

    return percentage * 9;
  }


  /// Internal events
  ///
  onEnd() {
    const repeat = this.store.getState().audio.repeat;

    if (repeat) {
      this.play(this.getActiveConnection());
    } else {
      this.store.dispatch(actions.shiftQueue());
    }
  }


  onPlay(event) {
    const rel = event.target.getAttribute('rel');
    const activeConnection = this.getActiveConnection();

    if (activeConnection.trackId === rel) {
      this.store.dispatch(actions.setAudioIsPlaying(true));
    }
  }


  onPause(event) {
    const rel = event.target.getAttribute('rel');
    const activeConnection = this.getActiveConnection();

    if (activeConnection.trackId === rel && !event.target.ended) {
      this.store.dispatch(actions.setAudioIsPlaying(false));
    }
  }


  onError(e) {
    switch (e.target.error.code) {
     case e.target.error.MEDIA_ERR_ABORTED:
       console.error('You aborted the audio playback.');
       break;
     case e.target.error.MEDIA_ERR_NETWORK:
       console.error('A network error caused the audio download to fail.');
       break;
     case e.target.error.MEDIA_ERR_DECODE:
       console.error('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
       break;
     case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
       console.error('The audio not be loaded, either because the server or network failed or because the format is not supported.');
       break;
     default:
       console.error('An unknown error occurred.');
       break;
    }
  }


  onCurrentTimeChange(event) {
    const currentTime = event.target.currentTime;
    window.currentAudioTime = currentTime;
  }


  /// Prerequisites
  ///
  setAudioContext() {
    if (window.AudioContext) {
      this.ac = new window.AudioContext();
    } else if (window.webkitAudioContext) {
      this.ac = new window.webkitAudioContext();
    }

    return this.ac;
  }


  createAudioElementsContainer() {
    const el = document.createElement('div');
    el.className = 'audio-elements-container';
    el.setAttribute('style', [
      'height:1px;position:absolute;right:0;top:0;',
      'visibility:hidden;width:1px;z-index:-1;',
    ].join(''));

    // add to body element
    document.body.appendChild(el);

    // store el
    this.audioElementsContainer = el;
  }


  /// Nodes
  ///
  createChannelSplitterNode() {
    const node = this.ac.createChannelSplitter(2);

    // store node
    this.nodes.channelSplitter = node;
  }


  createVolumeNode() {
    const node = this.ac.createGain();

    // value
    node.gain.value = 1;

    // connect to destination
    node.connect(this.nodes.biquad.low);

    // store node
    this.nodes.volume = node;
  }


  createBiquadFilterNodes() {
    const low = this.ac.createBiquadFilter();
    const mid = this.ac.createBiquadFilter();
    const hi = this.ac.createBiquadFilter();

    // set filter types
    low.type = 'lowshelf';
    mid.type = 'peaking';
    hi.type = 'highshelf';

    // values
    low.frequency.value = 250;
    mid.frequency.value = 2750;
    hi.frequency.value = 8000;

    mid.Q.value = 1;

    // connect nodes
    low.connect(mid);
    mid.connect(hi);
    hi.connect(this.ac.destination);

    // store nodes
    this.nodes.biquad = { low, mid, hi };
  }


  /// Connections
  ///
  createNewAudioElement(track, trackId) {
    const audioElement = new window.Audio();
    const source = findWhere(this.store.getState().sources.items, { uid: track.sourceUid });
    const url = sourceUtils.getSignedUrl(source, track.path);

    // track
    audioElement.setAttribute('src', url);
    audioElement.setAttribute('rel', trackId);
    audioElement.setAttribute('crossorigin', 'anonymous');

    // load
    audioElement.load();

    // play
    const promise = new Promise((resolve) => {
      audioElement.canPlayHandler = () => {
        resolve({
          trackId,
          bindAudioEvents: () => {
            audioElement.addEventListener('error', ::this.onError);
            audioElement.addEventListener('timeupdate', ::this.onCurrentTimeChange);
            audioElement.addEventListener('ended', ::this.onEnd);
            audioElement.addEventListener('play', ::this.onPlay);
            audioElement.addEventListener('pause', ::this.onPause);
          }
        });
      };

      audioElement.addEventListener('canplay', audioElement.canPlayHandler);
    });

    // add element to dom
    document
      .querySelector('.audio-elements-container')
      .appendChild(audioElement);

    // add to collection
    this.audioElements.push(audioElement);

    // return
    return { audioElement, promise };
  }


  createConnection(track, trackId) {
    const { audioElement, promise } = this.createNewAudioElement(track, trackId);
    audioElement.volume = 1;

    // set loading to 'true'
    this.store.dispatch(audioActions.setAudioIsLoading(true));

    // make a connection between the audio element and the volume node
    const connection = this.ac.createMediaElementSource(audioElement);

    if (!connection.mediaElement) {
      connection.mediaElement = audioElement;
    }

    connection.connect(this.nodes.volume);
    connection.trackId = trackId;

    // store connection
    this.connections.push(connection);

    // return
    return { connection, promise };
  }


  removeConnection(connection) {
    // remove all event listeners
    connection.mediaElement.removeEventListener('error', ::this.onError);
    connection.mediaElement.removeEventListener('timeupdate', ::this.onCurrentTimeChange);
    connection.mediaElement.removeEventListener('ended', ::this.onEnd);
    connection.mediaElement.removeEventListener('play', ::this.onPlay);
    connection.mediaElement.removeEventListener('pause', ::this.onPause);
    connection.mediaElement.removeEventListener('canplay', connection.mediaElement.canPlayHandler);

    // pause
    connection.mediaElement.pause();

    // disconnect
    connection.disconnect();

    // remove audio element from array
    this.audioElements.splice(this.audioElements.indexOf(connection.mediaElement), 1);

    // remove audio element from DOM
    connection.mediaElement.parentNode.removeChild(connection.mediaElement);

    // nullify
    this.connections.splice(this.connections.indexOf(connection), 1);
  }


  removeAllConnectionsExcept(connection) {
    this.connections.filter((c) => c.trackId !== connection.trackId).forEach((c) => {
      this.removeConnection(c);
    });
  }


  getActiveConnection() {
    const activeItem = this.store.getState().queue.activeItem;

    if (!activeItem) {
      return null;
    }

    const trackId = trackUtils.generateTrackId(activeItem);
    return find(this.connections, (c) => c.trackId === trackId);
  }


  /// Playback
  ///
  insert(track) {
    const trackId = trackUtils.generateTrackId(track);
    const existingConnection = find(this.connections, (c) => c.trackId === trackId);

    if (existingConnection) {
      this.removeAllConnectionsExcept(existingConnection);
      this.play(existingConnection);

    } else {
      const { connection, promise } = this.createConnection(track, trackId);

      promise.then(
        (connectionFeedback) => {
          // check if connection is still the last in line
          const a = this.connections.map((c) => c.trackId).indexOf(connectionFeedback.trackId);
          const b = this.connections.length - 1;
          const isLast = (a === b);

          if (isLast) {
            this.removeAllConnectionsExcept( this.connections[this.connections.length - 1] );
            this.store.dispatch( actions.setAudioDuration(connection.mediaElement.duration) );

            connectionFeedback.bindAudioEvents();

            setTimeout(() => {
              window.currentAudioTime = 0;
              this.store.dispatch(audioActions.setAudioIsLoading(false));
              if (this.store.getState().audio.isPlaying) this.play(connection);
            }, 0);
          }
        }
      );

    }
  }


  play(connection) {
    connection.mediaElement.play();
  }


  pause(connection) {
    connection.mediaElement.pause();
  }


  seek(connection, percentageDecimal) {
    const duration =  connection.mediaElement.duration;

    if (!isNaN(duration) && !isNaN(percentageDecimal)) {
      connection.mediaElement.currentTime = duration * percentageDecimal;
    }
  }

}
