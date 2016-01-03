import { createElement, Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import List from '../../List';


class Queue extends Component {

  render() {
    const items = this.props.queue.history.slice(0).reverse().slice(0, 250).map((track, idx) => {
      return {
        key: idx,
        title: (<span>
          <strong style={{ fontWeight: '500' }}>{track.properties.title}</strong>
          <span> &nbsp;&mdash;&nbsp; {track.properties.artist}</span>
        </span>),
      };
    });

    const actions = [];

    return (
      <ContentWithMenu
        title="History"
        menuItems={[]}
      >
        <List
          items={items}
          emptyIcon="list"
          emptyMessage="Nothing has been played yet."
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
