import { createElement, Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import List from '../../List';


class Queue extends Component {

  render() {
    const prefixStyles = {
      display: 'inline-block',
      marginRight: '.75rem',
      opacity: '.65',
    };

    const items = this.props.queue.items.map((track, idx) => {
      const prefix = track.injected ?
        <span style={prefixStyles}>[ added ]</span> :
        null;

      return {
        key: idx,
        title: (<span>
          {prefix}
          <span>{track.properties.title}</span>
          <span> &nbsp;&mdash;&nbsp; {track.properties.artist}</span>
        </span>),
      };
    });

    const actions = [
      {
        key: 'remove',
        label: 'Remove',
        icon: 'circle-with-cross',
        clickHandler: (event) => {
          const li = event.target.closest('li');
          const idx = li.getAttribute('data-key');

          this.props.actions.removeItemFromQueue(idx);
        },
      },
    ];

    return (
      <ContentWithMenu
        title="Queue"
        menuItems={[]}
      >
        <List
          items={items}
          emptyIcon="list"
          emptyMessage="Nothing in the queue yet."
          actions={actions}
          isNumbered
          isSmall
        />
      </ContentWithMenu>
    );
  }

}


Queue.propTypes = {
  actions: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
};


export default Queue;
