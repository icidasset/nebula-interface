import * as actions from '../../actions/audio';


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
    this.store.subscribe(this.handleExternalEvents);
    this.lastState = { audio: null, queue: null };

    // audio
    this.sources = {};
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

    // check if the state, that we need, changed
    if (state.audio === this.lastState.audio &&
        state.queue === this.lastState.queue) return;

    this.lastState.audio = state.audio;
    this.lastState.queue = state.queue;

    // it's all good
    this.setNodeValue('volume', state.audio.volume);
  }


  /// Internal events
  ///
  onEnd() {
    const repeat = this.store.getState().audio.repeat;

    if (repeat) {
      // this.play(currentTrack);
    } else {
      // actions.shiftQueue();
    }
  }


  onDurationChange(event) {
    const duration = event.target.duration;

    this.store.dispatch(actions.setAudioDuration(duration));
  }


  onCurrentTimeChange(event) {
    const currentTime = event.target.currentTime;

    this.store.dispatch(actions.setAudioCurrentTime(currentTime));
  }


  onProgress(event) {
    const progress = event.target.buffered.length && event.target.duration ?
      (event.target.buffered.end(0) / event.target.duration) * 100 :
      0;

    this.store.dispatch(actions.setAudioProgress(progress));
  }


  onError() {
    // TODO
  }


  /// Prerequisites
  ///
  setAudioContext() {
    if (!window.AudioContext) {
      this.ac = new window.AudioContext();
    } else if (!window.webkitAudioContext) {
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


  /// Audio elements
  ///
  createNewAudioElement(track) {
    const audioElement = new window.Audio();
    const src = 'TODO';

    // track
    audioElement.setAttribute('src', src);
    audioElement.setAttribute('rel', track.id);
    audioElement.setAttribute('crossorigin', 'anonymous');

    // events, in order of the w3c spec
    audioElement.addEventListener('progress', this.onProgress);
    audioElement.addEventListener('error', this.onError);
    audioElement.addEventListener('timeupdate', this.onCurrentTimeChange);
    audioElement.addEventListener('ended', this.onEnd);
    audioElement.addEventListener('durationchange', this.onDurationChange);

    // load
    audioElement.load();

    // play
    audioElement.addEventListener('canplay', () => this.play());

    // add element to dom
    document
      .querySelector('.audio-elements-container')
      .append(audioElement);

    // add to collection
    this.audioElements.push(audioElement);

    // return
    return audioElement;
  }


  /// Playback
  ///
  insert() {}


  play() {}


  pause() {}

}
