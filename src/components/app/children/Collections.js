import { createElement, Component, PropTypes } from 'react';

import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';
import Icon from '../../Icon';
import Link from '../../Link';
import List from '../../List';


class Collections extends Component {

  /// {actions} Index
  ///
  handleIndexDelete(event) {
    const uid = event.target.closest('li').getAttribute('data-key');
    this.props.actions.deleteCollection(uid);
  }


  handleIndexEdit() {
    alert('TODO - Implement collection edit');
  }


  /// {actions} Add
  ///
  handleAdd() {
    this.props.actions.addCollection({
      name: this.refs.name.value,
    });

    this.props.actions.goTo('/app/collections');
  }


  goToAdd() {
    this.props.actions.goTo('/app/collections/add');
  }


  /// {view} Index
  ///
  renderIndexItems() {
    const items = this.props.collections.items.map((collection) => {
      return { key: collection.uid, title: collection.name };
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
        emptyMessage="No collections found."
        emptyNote="Click to add one."
        emptyClickHandler={this.goToAdd.bind(this)}
        actions={actions}
      />
    );
  }


  renderIndex() {
    return this.renderIndexItems();
  }


  /// {view} Add
  ///
  renderForm(rel, values, buttonLabel) {
    const inputs = (
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          ref="name"
          placeholder="e.g. Favourites"
          defaultValue={values.name}
          autoFocus
          required
        />
      </div>
    );

    return (
      <Form
        buttonLabel={buttonLabel}
        info={[]}
        inputs={inputs}
        note={<span></span>}
        onSubmit={this.handleAdd.bind(this)}
      />
    );
  }


  renderAdd() {
    return this.renderForm(null, { name: '' }, 'Add');
  }


  renderEdit(uid) {
    const collection = this.props.collections.find((c) => c.uid === uid);
    return this.renderForm(uid, { name: collection.name }, 'Save');
  }


  /// {render}
  ///
  render() {
    const childRoute = this.props.routing.path.split('/')[3] || 'index';
    const childView = childRoute.slice(0, 1).toUpperCase() + childRoute.slice(1);
    const childViewParam = this.props.routing.path.split('/')[4];

    const menuItems = [
      <Link key="index" to="/app/collections">
        <Icon icon="text-document-inverted" /> Index
      </Link>,
      <Link key="add" to="/app/collections/add">
        <Icon icon="plus" /> Add new
      </Link>,
    ];

    return (
      <ContentWithMenu
        menuItems={menuItems}
        title="Collections"
      >
        { this[`render${childView}`](childViewParam) }
      </ContentWithMenu>
    );
  }

}


Collections.propTypes = {
  actions: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
};


export default Collections;
