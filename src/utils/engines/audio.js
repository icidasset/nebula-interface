import find from 'lodash/collection/find';
import findWhere from 'lodash/collection/findWhere';
import last from 'lodash/array/last';

import * as audioActions from '../../actions/audio';
import * as queueActions from '../../actions/queue';
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
    this.store = store;
    this.store.subscribe(this.handleExternalEvents.bind(this));
    this.lastState = { audio: null, queue: null };

    // audio
    this.activeConnection = null;
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
  }


  setNodeValue(nodeKey, value) {
    const node = this.nodes[nodeKey];

    // check if node exists
    if (!node) return;

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
  handleExternalEvents() {
    const state = this.store.getState();
    const audio = state.audio;
    const activeQueueItem = state.queue.activeItem;

    const audioChanged = (audio !== this.lastState.audio);
    const activeQueueItemChanged = (activeQueueItem !== this.lastState.activeQueueItem);

    // check if the state, that we need, changed
    if (!audioChanged && !activeQueueItemChanged) return;

    this.lastState.audio = audio;
    this.lastState.activeQueueItem = activeQueueItem;

    // (1) active queue item
    if (activeQueueItemChanged && activeQueueItem) {
      this.insert(activeQueueItem);
    }

    // (2) audio
    if (!audioChanged) return;

    // (2.1) play / pause
    const connection = this.activeConnection;

    if (connection) {
      if (connection.mediaElement.paused && audio.isPlaying) {
        this.play(connection);
      } else if (!connection.mediaElement.paused && !audio.isPlaying) {
        this.pause(connection);
      }
    }

    // (2.2) volume
    this.setNodeValue(
      'volume',
      audio.isMuted ? 0 : audio.volume
    );
  }


  /// Internal events
  ///
  onEnd() {
    const repeat = this.store.getState().audio.repeat;

    if (repeat) {
      this.play(this.activeConnection);
    } else {
      this.store.dispatch(actions.shiftQueue());
    }
  }


  onDurationChange(event) {
    const duration = event.target.duration;

    this.store.dispatch(actions.setAudioDuration(duration));
  }


  onPlay() {
    this.store.dispatch(actions.setAudioIsPlaying(true));
  }


  onPause() {
    this.store.dispatch(actions.setAudioIsPlaying(false));
  }


  onError() {
    console.error('PLAYBACK ERROR (TODO)');
  }


  // NOTE:
  // THESE EVENTS DO NOT TRIGGER STATE CHANGES,
  // I.E. THEY DO NOT DISPATCH AN ACTION.
  //
  // This was done for performance reasons.
  // These values change every 250ms, more or less.
  // Instead use requestAnimationFrame, setInterval
  // or something else to render these values.
  //
  onCurrentTimeChange(event) {
    const currentTime = event.target.currentTime;

    this.store.getState().audio.currentTime = currentTime;
  }


  onProgress(event) {
    const progress = event.target.buffered.length && event.target.duration ?
      (event.target.buffered.end(0) / event.target.duration) * 100 :
      0;

    this.store.getState().audio.progress = progress;
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
  createNewAudioElement(track, rel) {
    const audioElement = new window.Audio();
    const source = findWhere(this.store.getState().sources.items, { uid: track.sourceId });
    const url = sourceUtils.getSignedUrl(source, track.path);

    // track
    audioElement.setAttribute('src', url);
    audioElement.setAttribute('rel', rel);
    audioElement.setAttribute('crossorigin', 'anonymous');

    // events
    audioElement.addEventListener('progress', ::this.onProgress);
    audioElement.addEventListener('error', ::this.onError);
    audioElement.addEventListener('timeupdate', ::this.onCurrentTimeChange);
    audioElement.addEventListener('ended', ::this.onEnd);
    audioElement.addEventListener('durationchange', ::this.onDurationChange);

    audioElement.addEventListener('play', ::this.onPlay);
    audioElement.addEventListener('pause', ::this.onPause);

    // load
    audioElement.load();

    // play
    audioElement.addEventListener('canplay', (event) => event.target.play());

    // add element to dom
    document
      .querySelector('.audio-elements-container')
      .appendChild(audioElement);

    // add to collection
    this.audioElements.push(audioElement);

    // return
    return audioElement;
  }


  createConnection(track, trackId) {
    let audioElement;

    audioElement = this.createNewAudioElement(track);
    audioElement.volume = 1;

    // make a connection between the audio element and the volume node
    // -> do a setTimeout to ensure the audio element has been added to the DOM
    const makeConnection = () => {
      const connection = this.ac.createMediaElementSource(audioElement);

      if (!connection.mediaElement) {
        connection.mediaElement = audioElement;
      }

      connection.connect(this.nodes.volume);
      connection.trackId = trackId;

      this.connections.push(connection);
    };

    setTimeout(makeConnection, 0);
  }


  removeConnection(connection) {
    connection.mediaElement.pause();

    // remove all event listeners
    connection.mediaElement.removeEventListener('progress');
    connection.mediaElement.removeEventListener('error');
    connection.mediaElement.removeEventListener('timeupdate');
    connection.mediaElement.removeEventListener('ended');
    connection.mediaElement.removeEventListener('durationchange');
    connection.audioElement.removeEventListener('play');
    connection.audioElement.removeEventListener('pause');
    connection.mediaElement.removeEventListener('canplay');

    // disconnect
    connection.mediaElement.setAttribute('src', '');
    connection.disconnect();

    // remove audio element from array
    this.audioElements.splice(this.audioElements.indexOf(connection.mediaElement), 1);

    // remove audio element from DOM
    connection.mediaElement.parentNode.removeChild(connection.mediaElement);

    // nullify
    this.connections.splice(this.connections.indexOf(connection), 1);
    connection.mediaElement = null;
  }


  removeAllConnectionsExcept(connection) {
    this.connections.filter((c) => c.trackId !== connection.trackId).forEach((c) => {
      this.removeConnection(c);
    });
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
      this.createConnection(track, trackId);

    }
  }


  play(connection) {
    connection.mediaElement.play();
  }


  pause(connection) {
    connection.mediaElement.pause();
  }


  seek(connection, percent) {
    connection.mediaElement.currentTime = connection.mediaElement.duration * percent;
  }

}
