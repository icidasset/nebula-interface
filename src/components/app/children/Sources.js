import React, { Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';
import Link from '../../Link';
import List from '../../List';


class Sources extends Component {

  handleAdd() {}


  /// {view} Index
  ///
  renderIndex() {
    const items = [
      { title: 'Collection #1' },
      { title: 'Collection #2' },
      { title: 'Collection #3' },
    ];

    return (<List items={items} />);
  }


  /// {view} Add
  ///
  renderAdd() {
    const inputs = (
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" ref="name" placeholder="Music collection" autoFocus required />

        <label htmlFor="access_key">Access Key</label>
        <input type="text" id="access_key" ref="access_key" placeholder="XYZ" autoFocus required />

        <label htmlFor="secret_key">Secret Key</label>
        <input type="password" id="secret_key" ref="secret_key" placeholder="•••••" autoFocus required />
      </div>
    );

    return (
      <Form
        buttonLabel="Add"
        info={[]}
        inputs={inputs}
        note={<span></span>}
        onSubmit={this.handleAdd.bind(this)}
      />
    );
  }


  /// {render}
  ///
  render() {
    const childRoute = this.props.routing.path.split('/')[3] || 'index';
    const childView = childRoute.slice(0, 1).toUpperCase() + childRoute.slice(1);

    const menuItems = [
      <Link key="index" to="/app/sources">
        <i className="material-icons">inbox</i> Overview
      </Link>,
      <Link key="add" to="/app/sources/add">
        <i className="material-icons">add</i> Add new
      </Link>,
    ];

    return (
      <ContentWithMenu
        menuItems={menuItems}
        title="Sources"
      >
        { this[`render${childView}`]() }
      </ContentWithMenu>
    );
  }

}


Sources.propTypes = {
  routing: PropTypes.object.isRequired,
  sources: PropTypes.array,
};


export default Sources;
