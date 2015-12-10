import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Boxes from './Boxes';
import Mixer from './Mixer';

import styles from './Header.pcss';


class Header extends Component {

  render() {
    return (
      <header styleName="header">
        <Mixer
          actions={this.props.actions}
          audio={this.props.audio}
          queue={this.props.queue}
        />

        <Boxes
          actions={this.props.actions}
          routing={this.props.routing}
          tracks={this.props.tracks}
        />
      </header>
    );
  }

}


Header.propTypes = {
  actions: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


export default CSSModules(Header, styles);
