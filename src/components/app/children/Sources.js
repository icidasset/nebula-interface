import React, { Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';
import Link from '../../Link';
import List from '../../List';

import * as sourcesActionTypes from '../../../constants/action_types/sources';


class Sources extends Component {

  /// {actions} Index
  ///
  handleIndexDelete(event) {
    const uid = event.target.closest('li').getAttribute('data-key');
    this.props.actions.deleteSource(uid);
  }


  handleIndexEdit() {
    alert('TODO - Implement source edit');
  }


  /// {actions} Add
  ///
  handleAdd() {
    this.props.actions.addSource({
      type: sourcesActionTypes.SOURCE_TYPE_AWS_BUCKET,
      name: this.refs.name.value,

      properties: {
        accessKey: this.refs.accessKey.value,
        secretKey: this.refs.secretKey.value,
        bucket: this.refs.bucket.value,
      },

      settings: {
        directoryCollections: this.refs.directoryCollections.checked,
      },
    });

    this.props.actions.goTo('/app/sources');
  }


  goToAdd() {
    this.props.actions.goTo('/app/sources/add');
  }


  /// {view} Index
  ///
  renderIndexProcessing() {
    return (
      <List
        items={[]}
        emptyIcon="sync"
        emptyMessage="Processing sources"
      />
    );
  }


  renderIndexItems() {
    const items = this.props.sources.items.map((source) => {
      return { key: source.uid, title: source.name };
    });

    const actions = [
      {
        key: 'delete',
        label: 'Delete',
        icon: 'close',
        clickHandler: ::this.handleIndexDelete,
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: 'mode_edit',
        clickHandler: ::this.handleIndexEdit,
      },
    ];

    return (
      <List
        items={items}
        emptyClickHandler={this.goToAdd.bind(this)}
        emptyIcon="add_circle"
        emptyMessage="Add some music to your life"
        actions={actions}
      />
    );
  }


  renderIndex() {
    if (this.props.sources.isProcessing) {
      return this.renderIndexProcessing();
    }

    return this.renderIndexItems();
  }


  /// {view} Add
  ///
  renderAdd() {
    const inputs = (
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" ref="name" placeholder="Music collection" autoFocus required />

        <label htmlFor="accessKey">Access Key</label>
        <input type="text" id="accessKey" ref="accessKey" placeholder="Access key" required />

        <label htmlFor="secretKey">Secret Key</label>
        <input type="password" id="secretKey" ref="secretKey" placeholder="•••••••••" required />

        <label htmlFor="bucket">Bucket</label>
        <input type="text" id="bucket" ref="bucket" placeholder="Bucket" required />

        <h3>Settings</h3>

        <div className="input__checkbox">
          <input type="checkbox" id="directoryCollections" ref="directoryCollections" />
          <label htmlFor="directoryCollections">Enable directory collections</label>
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
        <i className="material-icons">list</i> Index
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
