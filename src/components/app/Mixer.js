import { createElement, Component } from 'react';
import CSSModules from 'react-css-modules';

import Icon from '../Icon';
import styles from './Mixer.pcss';


class Mixer extends Component {

  render() {
    return (
      <div styleName="mixer">

        <div styleName="time">
          <span styleName="time__current">0:00</span>
          <span styleName="time__duration">3:14</span>
        </div>

        { /* play - pause */ }
        <div styleName="button play-pause">
          <div styleName="light"></div>
          <div styleName="button__label">PLAY</div>
          <div styleName="button__icons">
            <Icon icon="controller-play"/>
            <span>/</span>
            <Icon icon="controller-pause"/>
          </div>
        </div>

        { /* previous - next */ }
        <div styleName="button-group">
          <div styleName="button">
            <div styleName="button__icons">
              <Icon icon="controller-fast-backward"/>
            </div>
          </div>
          <div styleName="button">
            <div styleName="button__icons">
              <Icon icon="controller-fast-forward"/>
            </div>
          </div>
        </div>

        { /* shuffle */ }
        <div styleName="button">
          <div styleName="light"></div>
          <div styleName="button__icons">
            <Icon icon="shuffle"/>
          </div>
        </div>

        { /* repeat */ }
        <div styleName="button">
          <div styleName="light"></div>
          <div styleName="button__icons">
            <Icon icon="cycle"/>
          </div>
        </div>

      </div>
    );
  }

}


export default CSSModules(Mixer, styles, { allowMultiple: true });
