import { createElement, Component, PropTypes } from 'react';
import InputRange from 'react-input-range';

import ContentWithMenu from '../../ContentWithMenu';


class Equalizer extends Component {

  constructor(props) {
    super();

    this.state = {
      low: props.audio.filterValues[0],
      mid: props.audio.filterValues[1],
      hi: props.audio.filterValues[2],
      volume: Math.round(props.audio.volume * 100),
    };
  }


  handleChange(component, value) {
    const obj = {};
    const that = this[0];
    const key = this[1];

    obj[key] = value;

    that.setState(obj, () => {
      that.sendValues(key);
    });
  }


  sendValues(key) {
    if (key === 'volume') {
      this.props.actions.setAudioVolume(
        this.state.volume / 100
      );
    } else {
      this.props.actions.setAudioFilterValues([
        this.state.low,
        this.state.mid,
        this.state.hi,
      ]);
    }
  }


  render() {
    const parStyles = {
      fontSize: '.95rem',
      fontWeight: '500',
      textAlign: 'center',
    };

    const spanStyles = {
      cursor: 'pointer',
      display: 'inline-block',
    };

    const parClick = function() {
      const obj = {};
      obj[this[1]] = (this[1] === 'volume' ? 50 : 0);
      this[0].setState(obj, () => {
        this[0].sendValues('volume');
        this[0].sendValues('all');
      });
    };

    return (
      <ContentWithMenu
        title="Equalizer"
        menuItems={[]}
      >
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.volume}
          onChange={this.handleChange.bind([ this, 'volume' ])}
        />
        <p style={parStyles}>
          <span style={spanStyles} onClick={parClick.bind([ this, 'volume' ])}>Volume</span>
        </p>

        <InputRange
          maxValue={this.props.audio.filterValueMax}
          minValue={-this.props.audio.filterValueMax}
          value={this.state.low}
          onChange={this.handleChange.bind([ this, 'low' ])}
        />
        <p style={parStyles}>
          <span style={spanStyles} onClick={parClick.bind([ this, 'low' ])}>Low band</span>
        </p>

        <InputRange
          maxValue={this.props.audio.filterValueMax}
          minValue={-this.props.audio.filterValueMax}
          value={this.state.mid}
          onChange={this.handleChange.bind([ this, 'mid' ])}
        />
        <p style={parStyles}>
          <span style={spanStyles} onClick={parClick.bind([ this, 'mid' ])}>Mid band</span>
        </p>

        <InputRange
          maxValue={this.props.audio.filterValueMax}
          minValue={-this.props.audio.filterValueMax}
          value={this.state.hi}
          onChange={this.handleChange.bind([ this, 'hi' ])}
        />
        <p style={parStyles}>
          <span style={spanStyles} onClick={parClick.bind([ this, 'hi' ])}>Hi band</span>
        </p>
      </ContentWithMenu>
    );
  }

}


Equalizer.propTypes = {
  actions: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
};


export default Equalizer;
