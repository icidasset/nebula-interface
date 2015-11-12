import { createElement, PropTypes } from 'react';
import { connect } from 'react-redux';

import ComponentWithInfo from '../components/ComponentWithInfo';
import Form from '../components/Form';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';


class ResetPasswordPage extends ComponentWithInfo {

  resetPassword(email) {
    return this.props.dispatch(actions.resetPassword(email)).then(
      () => this.setInfo('success', 'An email has been sent.'),
      (error) => this.setInfo('error', error)
    );
  }


  handleSubmit() {
    const email = this.refs.email.value;
    return this.resetPassword(email);
  }


  render() {
    const note = (
      <span>
        <span>Looking for the </span>
        <Link to="/sign-in">sign in</Link> page?
      </span>
    );

    // input elements
    const inputs = (
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref="email" placeholder="user@email.com" autoFocus required />
      </div>
    );

    // render
    return (
      <Middle>

        <h1>
          <i className="material-icons">perm_identity</i>
          Reset password
        </h1>

        <Form
          buttonLabel="Reset password"
          info={this.state.info}
          inputs={inputs}
          note={note}
          onSubmit={this.handleSubmit.bind(this)}
        />

      </Middle>
    );
  }

}


ResetPasswordPage.propTypes = {
  dispatch: PropTypes.func,
};


export default connect()(ResetPasswordPage);
