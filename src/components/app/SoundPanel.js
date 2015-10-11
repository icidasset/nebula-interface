import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './SoundPanel.scss';


@CSSModules(styles)
export default class SoundPanel extends Component {

  render() {
    return (<div styleName="sound-panel"></div>);
  }

}
