import { createElement, Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';
import Icon from '../../Icon';
import Link from '../../Link';
import List from '../../List';

import * as sourcesActionTypes from '../../../constants/action_types/sources';


class Sources extends Component {

  /// {actions} Index
  ///
  handleIndexDelete(event) {
    if (window.confirm('Are you sure you want to remove this source?')) {
      const uid = event.target.closest('li').getAttribute('data-key');
      this.props.actions.deleteSource(uid);
    }
  }


  handleIndexEdit(event) {
    const uid = event.target.closest('li').getAttribute('data-key');
    this.goToEdit(uid);
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


  /// {actions} Edit
  ///
  handleEdit() {
    const sourceUid = this.props.routing.path.split('/')[4];

    this.props.actions.updateSource(sourceUid, {
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


  goToEdit(uid) {
    this.props.actions.goTo(`/app/sources/edit/${uid}`);
  }


  /// {view} Index
  ///
  renderIndexProcessing() {
    return (
      <List
        items={ [] }
        emptyIcon="thunder-cloud"
        emptyMessage="Processing sources"
        emptyNote={ Math.round(this.props.sources.processingProgress * 100).toString() + '%' }
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
        icon: 'trash',
        clickHandler: this.handleIndexDelete.bind(this),
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: 'edit',
        clickHandler: this.handleIndexEdit.bind(this),
      },
    ];

    return (
      <List
        items={items}
        emptyIcon="add-to-list"
        emptyMessage="No sources found."
        emptyNote="Click to add one."
        emptyClickHandler={this.goToAdd.bind(this)}
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


  /// {view} Add, edit & info
  ///
  renderForm(buttonLabel, onSubmit, source) {
    const values = {
      name: source ? source.name : null,

      accessKey: source ? source.properties.accessKey : null,
      secretKey: source ? source.properties.secretKey : null,
      bucket: source ? source.properties.bucket : null,

      directoryCollections: source ? source.settings.directoryCollections : false,
    };

    const inputs = (
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          ref="name"
          placeholder="e.g. Music collection"
          defaultValue={values.name}
          autoFocus
          required
        />

        <label htmlFor="accessKey">Access Key</label>
        <input
          type="text"
          id="accessKey"
          ref="accessKey"
          placeholder="Access key"
          defaultValue={values.accessKey}
          required
        />

        <label htmlFor="secretKey">Secret Key</label>
        <input
          type="password"
          id="secretKey"
          ref="secretKey"
          placeholder="•••••••••"
          defaultValue={values.secretKey}
          required
        />

        <label htmlFor="bucket">Bucket</label>
        <input
          type="text"
          id="bucket"
          ref="bucket"
          placeholder="Bucket"
          defaultValue={values.bucket}
          required
        />

        <h3>Settings</h3>

        <div className="input__checkbox">
          <input
            type="checkbox"
            id="directoryCollections"
            ref="directoryCollections"
            defaultChecked={values.directoryCollections}
          />
          <label htmlFor="directoryCollections">
            <span>Enable directory collections </span>
            <small>(Root directories become collections)</small>
          </label>
        </div>
      </div>
    );

    return (
      <Form
        buttonLabel={buttonLabel}
        info={[]}
        inputs={inputs}
        note={<span></span>}
        onSubmit={onSubmit.bind(this)}
      />
    );
  }


  renderAdd() {
    return this.renderForm('Add', this.handleAdd);
  }


  renderEdit() {
    const sourceUid = this.props.routing.path.split('/')[4];
    const source = this.props.sources.items.find((s) => s.uid === sourceUid);
    return this.renderForm('Save', this.handleEdit, source);
  }


  renderInfo() {
    return (
      <div>
        <p>
          Sources are the places where your music is stored.
          Or in other words, your cloud-storage accounts.
        </p>
      </div>
    );
  }


  /// {render}
  ///
  render() {
    const childRoute = this.props.routing.path.split('/')[3] || 'index';
    const childView = childRoute.slice(0, 1).toUpperCase() + childRoute.slice(1);

    const menuItems = [
      <Link key="index" to="/app/sources">
        <Icon icon="text-document-inverted" /> Index
      </Link>,
      <Link key="add" to="/app/sources/add">
        <Icon icon="plus" /> Add new
      </Link>,
      <a key="process" onClick={this.props.actions.processSources} style={{ cursor: 'pointer' }}>
        <Icon icon="thunder-cloud" /> Process sources
      </a>,
      <Link key="info" to="/app/sources/info">
        <Icon icon="help-with-circle" /> Info
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
