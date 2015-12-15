import { createElement, Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Dropdown from 'react-dropdown';

import Icon from '../Icon';

import styles from './Boxes.pcss';


class Boxes extends Component {

  getBoxStyleNames() {
    const def = 'box';
    const res = {
      tracks: [ def ],
      queue: [ def ],
      equalizer: [ def ],
      sources: [ def ],
    };

    switch (this.props.routing.path) {
    case '/app':
    case '/app/collections':
      res.tracks.push('is-active');
      break;
    case '/app/queue':
    case '/app/history':
      res.queue.push('is-active');
      break;
    case '/equalizer':
      res.equalizer.push('is-active');
      break;
    case '/app/sources':
      res.sources.push('is-active');
      break;
    }

    Object.keys(res).forEach((k) => res[k] = res[k].join(' '));

    return res;
  }


  getDropdownItems() {
    return {

      tracks: [
        { value: '{route}:/app', label: <strong>Show tracks</strong> },
        { value: '{route}:/app/collections', label: 'Manage collections' },
      ],

      queue: [
        { value: '{route}:/app/queue', label: <strong>Show queue</strong> },
        { value: '{route}:/app/history', label: 'Show history' },
        { value: '{action}:resetQueue', label: 'Reset queue' },
      ],

      equalizer: [
        {
          value: '{route}:/app/equalizer',
          label: <strong>Show equalizer</strong>,
        },
        { value: '{action}:toggleMute', label: 'Toggle mute' },
      ],

      sources: [
        { value: '{route}:/app/sources', label: <strong>Show sources</strong> },
        { value: '{action}:processSources', label: 'Process sources' },
      ],

    };
  }


  handleDropdownChange(option) {
    const [ type, value ] = option.value.split(':');

    switch (type) {
    case '{action}':
      this.props.actions[value]();
      break;
    case '{route}':
      this.props.actions.goTo(value);
      break;
    }
  }


  render() {
    const styleNames = this.getBoxStyleNames();
    const dropdownItems = this.getDropdownItems();
    const dropdownChangeHandler = this.handleDropdownChange.bind(this);

    return (
      <div styleName="boxes">

        <div styleName={styleNames.tracks}>
          <Icon icon="beamed-note"/>
          <div styleName="box__label">Tracks</div>
          <div styleName="box__category">&amp; COLLECTIONS</div>
          <Dropdown
            options={dropdownItems.tracks}
            onChange={dropdownChangeHandler}
            placeholder="Tracks"
          />
        </div>

        <div styleName={styleNames.queue}>
          <Icon icon="clock"/>
          <div styleName="box__label">Queue</div>
          <div styleName="box__category">&amp; HISTORY</div>
          <Dropdown
            options={dropdownItems.queue}
            onChange={dropdownChangeHandler}
            placeholder="Queue"
          />
        </div>

        <div styleName={styleNames.equalizer}>
          <Icon icon="sound-mix"/>
          <div styleName="box__label">Equalizer</div>
          <div styleName="box__category">CONTROLS</div>
          <Dropdown
            options={dropdownItems.equalizer}
            onChange={dropdownChangeHandler}
            placeholder="Equalizer"
          />
        </div>

        <div styleName={styleNames.sources}>
          <Icon icon="cog"/>
          <div styleName="box__label">Sources</div>
          <div styleName="box__category">INPUT</div>
          <Dropdown
            options={dropdownItems.sources}
            onChange={dropdownChangeHandler}
            placeholder="Sources"
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
