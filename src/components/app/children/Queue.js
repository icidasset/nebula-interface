import { createElement, Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import List from '../../List';


class Queue extends Component {

  render() {
    const items = this.props.queue.items.map((track, idx) => {
      return {
        key: idx,
        title: (<span>
          <strong style={{ fontWeight: '500' }}>{track.properties.title}</strong>
          <span> &nbsp;&mdash;&nbsp; {track.properties.artist}</span>
        </span>),
      };
    });

    const actions = [
      {
        key: 'remove',
        label: 'Remove',
        icon: 'trash',
        clickHandler: () => {
          alert('TODO - Implement delete-queue-item');
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
        />
      </ContentWithMenu>
    );
  }

}


Queue.propTypes = {
  queue: PropTypes.object.isRequired,
};


export default Queue;
