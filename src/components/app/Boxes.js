import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Icon from '../Icon';

import styles from './Boxes.pcss';


class Boxes extends Component {

  render() {
    return (
      <div styleName="boxes">

        <div styleName="box">
          <Icon icon="beamed-note"/>
          <div styleName="box__label">Favourites</div>
          <div styleName="box__category">COLLECTION</div>
        </div>

        <div styleName="box">
          <Icon icon="clock"/>
          <div styleName="box__label">Queue</div>
          <div styleName="box__category">DROPZONE</div>
        </div>

        <div styleName="box">
          <Icon icon="sound-mix"/>
          <div styleName="box__label">Equalizer</div>
          <div styleName="box__category">CONTROL</div>
        </div>

        <div styleName="box">
          <Icon icon="mask"/>
          <div styleName="box__label">Tracks</div>
          <div styleName="box__category">VIEW</div>
        </div>

      </div>
    );
  }

}


Boxes.propTypes = {
  actions: PropTypes.object.isRequired,
};


export default CSSModules(Boxes, styles);
