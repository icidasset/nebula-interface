import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Dropdown from 'react-dropdown';

import Icon from '../Icon';

import styles from './Boxes.pcss';


class Boxes extends Component {

  getBoxStyleNames() {
    const def = 'box';
    const res = {
      collection: [def],
      dropzone: [def],
      equalizer: [def],
      view: [def],
    };

    switch (this.props.routing.path) {
    case '/app':
      res.collection.push('is-active');
      break;
    case '/app/equalizer':
      res.equalizer.push('is-active');
      break;
    default:
      res.view.push('is-active');
    }

    Object.keys(res).forEach((k) => res[k] = res[k].join(' '));

    return res;
  }


  render() {
    const styleNames = this.getBoxStyleNames();

    const views = [
      { value: '/app', label: 'Tracks' },
      { value: '/app/sources', label: 'Sources' },
    ];

    const selectedView = views.find((i) => i.value === this.props.routing.path);
    const selectView = (option) => this.props.actions.goTo(option.value);

    return (
      <div styleName="boxes">

        <div styleName={styleNames.collection}>
          <Icon icon="beamed-note"/>
          <div styleName="box__label">Favourites</div>
          <div styleName="box__category">COLLECTION</div>
        </div>

        <div styleName={styleNames.dropzone}>
          <Icon icon="clock"/>
          <div styleName="box__label">Queue</div>
          <div styleName="box__category">DROPZONE</div>
        </div>

        <div styleName={styleNames.equalizer}>
          <Icon icon="sound-mix"/>
          <div styleName="box__label">Equalizer</div>
          <div styleName="box__category">CONTROL</div>
        </div>

        <div styleName={styleNames.view}>
          <Icon icon="mask"/>
          <div styleName="box__category">VIEW</div>
          <Dropdown
            options={views}
            onChange={selectView.bind(this)}
            value={selectedView}
            placeholder="Select an option"
          />
        </div>

      </div>
    );
  }

}


Boxes.propTypes = {
  actions: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
};


export default CSSModules(Boxes, styles, { allowMultiple: true });
