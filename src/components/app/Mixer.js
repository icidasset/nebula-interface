import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Icon from '../Icon';
import styles from './Mixer.pcss';


class Mixer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
    };
  }


  componentWillMount() {
    this.boundHandleTimeClick = this.handleTimeClick.bind(this);
    this.timeIntervalId = setInterval(() => {
      this.setState({ currentTime: window.currentAudioTime });
    }, 250);
  }


  componentWillUnmount() {
    clearInterval(this.timeIntervalId);
  }


  handleNowPlayingClick() {
    alert('TODO - Scroll to currently-playing track');
  }


  handleTimeClick(event) {
    const timeNode = event.target.closest(`.${styles.time}`);

    let offset;

    offset = event.pageX - timeNode.getBoundingClientRect().left;
    offset = offset < 0 ? 0 : offset;

    this.props.actions.seekAudio(
      offset / timeNode.clientWidth
    );
  }


  handlePreviousClick() {
    this.props.actions.unshiftQueue();
    this.props.actions.setAudioIsPlaying(true);
  }


  handleNextClick() {
    this.props.actions.shiftQueue();
    this.props.actions.setAudioIsPlaying(true);
  }


  /// Render
  ///
  renderNowPlaying() {
    if (this.props.queue.activeItem) {
      if (this.props.audio.isLoading) {
        return (
          <span styleName="now-playing__main">
            <span rel="title">Loading ...</span>
            <span rel="artist">
              {this.props.queue.activeItem.properties.title}
              <span> - </span>
              {this.props.queue.activeItem.properties.artist}
            </span>
          </span>
        );
      }

      return (
        <span styleName="now-playing__main">
          <span rel="title">{this.props.queue.activeItem.properties.title}</span>
          <span rel="artist">{this.props.queue.activeItem.properties.artist}</span>
        </span>
      );

    }

    return (
      <span styleName="now-playing__main">
        <span rel="title">Ongaku Ryoho</span>
        <span rel="artist">Music therapy</span>
      </span>
    );
  }


  renderTime() {
    const duration = this.props.audio.duration;
    const time = this.state.currentTime || 0;

    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - (minutes * 60));
    let progressPlayed = 0;

    if (duration) {
      progressPlayed = (time / duration) * 100;
    }

    if (minutes.toString().length === 1) minutes = `0${minutes}`;
    if (seconds.toString().length === 1) seconds = `0${seconds}`;

    const progressPlayedStyle = { width: `${progressPlayed}%` };

    return (
      <div styleName="time" onClick={this.boundHandleTimeClick}>
        <div styleName="time__current">{minutes}:{seconds}</div>
        <div styleName="time__duration">{this.props.audio.durationStamp}</div>
        <div styleName="time__progress">
          <div styleName="time__progress__played" style={progressPlayedStyle}></div>
        </div>
      </div>
    );
  }


  render() {
    const playPauseLight = `light ${this.props.audio.isPlaying ? 'is-on' : ''}`;
    const shuffleLight = `light ${this.props.queue.shuffle ? 'is-on' : ''}`;
    const repeatLight = `light ${this.props.queue.repeat ? 'is-on' : ''}`;

    return (
      <div styleName="mixer">

        { /* now playing */ }
        <div styleName="now-playing">
          { this.renderNowPlaying() }
        </div>

        { /* time */ }
        { this.renderTime() }

        { /* play - pause */ }
        <div styleName="button play-pause" onClick={this.props.actions.togglePlay}>
          <div styleName={playPauseLight}></div>
          <div styleName="button__label">PLAY</div>
          <div styleName="button__icons">
            <Icon icon="controller-play"/>
            <span>/</span>
            <Icon icon="controller-pause"/>
          </div>
        </div>

        { /* previous - next */ }
        <div styleName="button-group">
          <div styleName="button" onClick={this.handlePreviousClick.bind(this)}>
            <div styleName="button__icons">
              <Icon icon="controller-fast-backward"/>
            </div>
          </div>
          <div styleName="button" onClick={this.handleNextClick.bind(this)}>
            <div styleName="button__icons">
              <Icon icon="controller-fast-forward"/>
            </div>
          </div>
        </div>

        { /* shuffle */ }
        <div styleName="button" onClick={this.props.actions.toggleShuffle}>
          <div styleName={shuffleLight}></div>
          <div styleName="button__icons">
            <Icon icon="shuffle"/>
          </div>
        </div>

        { /* repeat */ }
        <div styleName="button" onClick={this.props.actions.toggleRepeat}>
          <div styleName={repeatLight}></div>
          <div styleName="button__icons">
            <Icon icon="cycle"/>
          </div>
        </div>

      </div>
    );
  }

}


Mixer.propTypes = {
  actions: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
};


export default CSSModules(Mixer, styles, { allowMultiple: true });
