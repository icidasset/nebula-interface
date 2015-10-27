import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Errors from '../components/Errors';
import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';


class SignInPage extends Component {

  constructor(props) {
    super(props);
    this.state = { errors: [] };
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).value,
      password: findDOMNode(this.refs.password).value,
    };

    // authenticate user and go to the app page
    this.props.dispatch(actions.authenticate(credentials)).then(
      () => this.props.dispatch(actions.goTo('/app')),
      (error) => { this.setState({ errors: [error.toString()] }); this.render(); }
    );

    event.preventDefault();
  }


  render() {
    return (
      <Middle>

        <h1>
          <i className="material-icons">perm_identity</i>
          Sign <strong>in</strong>
        </h1>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref="email" placeholder="user@email.com" autoFocus required />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref="password" placeholder="••••••••" required />
            </div>
          </div>

          <p>
            <button className="button">
              Sign in
            </button>
          </p>

          <Errors errors={this.state.errors} />

          <p className={FormStyles.note}>
            <span>Don't have an account yet, </span>
            <Link to="/sign-up">sign up</Link>.
          </p>
        </Form>

      </Middle>
    );
  }

}


SignInPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default connect()(SignInPage);
