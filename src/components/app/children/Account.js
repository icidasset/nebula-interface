import { createElement, Component, PropTypes } from 'react';

import ComponentWithInfo from '../../ComponentWithInfo';
import ContentWithMenu from '../../ContentWithMenu';
import Form from '../../Form';


class Account extends ComponentWithInfo {

  handleFormSubmit() {
    const newEmail = this.refs.email.value;
    const oldEmail = this.props.auth.user.password.email;

    const currentPassword = this.refs.currentPassword.value;
    const newPassword = this.refs.newPassword.value;

    const promises = [];

    if (newEmail !== oldEmail) {
      promises.push(this.setNewEmail(newEmail, currentPassword));
    }

    if (newPassword && newPassword.length > 0) {
      promises.push(this.setNewPassword(currentPassword, newPassword));
    }

    if (promises.length) {
      return Promise.all(promises).then(
        () => this.setInfo('success', 'Account details updated.'),
        (error) => this.setInfo('error', error)
      );
    }
  }

  setNewEmail(newEmail, password) {
    return this.props.actions.updateEmail(newEmail, password);
  }


  setNewPassword(currentPassword, newPassword) {
    return this.props.actions.updatePassword(currentPassword, newPassword);
  }


  renderForm() {
    const inputs = (
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          ref="email"
          placeholder="user@email.com"
          defaultValue={this.props.auth.user.password.email}
          autoFocus
          required
        />

        <label htmlFor="password">Current password</label>
        <input
          type="password"
          id="currentPassword"
          ref="currentPassword"
          placeholder="••••••••"
          minLength={5}
          required
        />

        <label htmlFor="password">New password</label>
        <input
          type="password"
          id="newPassword"
          ref="newPassword"
          placeholder="••••••••"
          minLength={5}
        />
      </div>
    );

    return (
      <Form
        buttonLabel="Save"
        info={this.state.info}
        inputs={inputs}
        note={<span></span>}
        onSubmit={this.handleFormSubmit.bind(this)}
      />
    );
  }


  render() {
    return (
      <ContentWithMenu
        menuItems={[]}
        title="Account"
      >
        { this.renderForm() }
      </ContentWithMenu>
    );
  }

}


Account.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};


export default Account;
