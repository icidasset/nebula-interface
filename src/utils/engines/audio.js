import find from 'lodash/collection/find';
import findWhere from 'lodash/collection/findWhere';
import last from 'lodash/array/last';

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
    const state = store.getState();

    // audio
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
    const node = this.nodes[nodeKey];

    // set value
    switch (nodeKey) {
    case 'low':
    case 'mid':
    case 'hi':
      return node.gain.value;
      break;

    default:
      return node.value;
    }
  }


  setNodeValue(nodeKey, value) {
    const node = this.nodes[nodeKey];

    // check if node exists
    if (!node) return;

    // check again
    if (this.getNodeValue(nodeKey) === value) return;

    // set value
    switch (nodeKey) {
    case 'low':
    case 'mid':
    case 'hi':
      node.gain.value = value;
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

    // audio - volume
    reduxUtils.observeStore(
      this.store,
      (s) => s.audio.volume,
      (v) => this.setNodeValue('volume', this.store.getState().audio.isMuted ? 0 : v)
    );
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


  onPlay() {
    this.store.dispatch(actions.setAudioIsPlaying(true));
  }


  onPause() {
    this.store.dispatch(actions.setAudioIsPlaying(false));
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

    this.store.dispatch(actions.setAudioCurrentTime(currentTime));
  }


  onProgress(event) {
    const progress = event.target.buffered.length && event.target.duration ?
      (event.target.buffered.end(0) / event.target.duration) * 100 :
      0;

    this.store.dispatch(actions.setAudioProgressLoaded(progress));
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

    // connect to analyser
    // TODO: node.connect(this.nodes.analyserLeft, 0, 0);
    // TODO: node.connect(this.nodes.analyserRight, 1, 0);

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

    // TODO: if shouldAnalyse
    // TODO: hi.connect(this.nodes.channelSplitter)

    // store nodes
    this.nodes.biquad = { low, mid, hi };
  }


  /// Connections
  ///
  createNewAudioElement(track, trackId) {
    const audioElement = new window.Audio();
    const source = findWhere(this.store.getState().sources.items, { uid: track.sourceId });
    const url = sourceUtils.getSignedUrl(source, track.path);

    // track
    audioElement.setAttribute('src', url);
    audioElement.setAttribute('rel', trackId);
    audioElement.setAttribute('crossorigin', 'anonymous');

    // load
    audioElement.load();

    // play
    const promise = new Promise((resolve) => {
      audioElement.addEventListener('canplay', () => {
        resolve({
          trackId,
          bindAudioEvents: () => {
            audioElement.addEventListener('progress', ::this.onProgress);
            audioElement.addEventListener('error', ::this.onError);
            audioElement.addEventListener('timeupdate', ::this.onCurrentTimeChange);
            audioElement.addEventListener('ended', ::this.onEnd);
            audioElement.addEventListener('play', ::this.onPlay);
            audioElement.addEventListener('pause', ::this.onPause);
          }
        });
      });
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
    connection.mediaElement.pause();

    // remove all event listeners
    connection.mediaElement.removeEventListener('progress');
    connection.mediaElement.removeEventListener('error');
    connection.mediaElement.removeEventListener('timeupdate');
    connection.mediaElement.removeEventListener('ended');
    connection.mediaElement.removeEventListener('play');
    connection.mediaElement.removeEventListener('pause');
    connection.mediaElement.removeEventListener('canplay');

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

            setTimeout(() => this.play(connection), 0);
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
