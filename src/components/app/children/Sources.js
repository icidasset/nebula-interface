import React, { Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';
import Link from '../../Link';
import List from '../../List';

import * as sourcesActionTypes from '../../../constants/action_types/sources';


class Sources extends Component {

  /// {actions} Index
  ///
  handleIndexClick(event) {
    console.log(event.target);
  }


  /// {actions} Add
  ///
  handleAdd() {
    this.props.actions.addSource({
      type: sourcesActionTypes.SOURCE_TYPE_AWS_BUCKET,
      name: this.refs.name.value,

      properties: {
        access_key: this.refs.access_key.value,
        secret_key: this.refs.secret_key.value,
      },

      settings: {
        directory_collections: this.refs.directory_collections.checked,
      },
    });
  }


  goToAdd() {
    this.props.actions.goTo('/app/sources/add');
  }


  /// {view} Index
  ///
  renderIndex() {
    const items = this.props.sources.items.map((source) => {
      return { title: source.name };
    });

    return (
      <List
        items={items}
        emptyClickHandler={this.goToAdd.bind(this)}
        emptyIcon="add_circle"
        emptyMessage="Add some music to your life"
        onClick={this.handleIndexClick.bind(this)}
      />);
  }


  /// {view} Add
  ///
  renderAdd() {
    const inputs = (
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" ref="name" placeholder="Music collection" autoFocus required />

        <label htmlFor="access_key">Access Key</label>
        <input type="text" id="access_key" ref="access_key" placeholder="XYZ" required />

        <label htmlFor="secret_key">Secret Key</label>
        <input type="password" id="secret_key" ref="secret_key" placeholder="•••••" required />

        <h3>Settings</h3>

        <div className="input__checkbox">
          <input type="checkbox" id="directory_collections" ref="directory_collections" />
          <label htmlFor="directory_collections">Enable directory collections</label>
        </div>
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
  actions: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
};


export default Sources;
