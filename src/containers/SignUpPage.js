import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Errors from '../components/Errors';
import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import * as actions from '../actions/auth';


class SignUpPage extends Component {

  constructor(props) {
    super(props);
    this.state = { errors: [] };
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).value,
      password: findDOMNode(this.refs.password).value,
    };

    // create user and log him/her in
    this.props.dispatch(actions.createUser(credentials)).then(
      () => this.props.dispatch(actions.authenticate(credentials)),
      (error) => { this.setState({ errors: [error.toString()] }); this.render(); }
    );

    event.preventDefault();
  }


  render() {
    return (
      <Middle>

        <h1>
          <i className="material-icons">perm_identity</i>
          Sign <strong>up</strong>
        </h1>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref="email" placeholder="user@email.com" autoFocus required />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref="password" placeholder="••••••••" minLength={5} required />
            </div>
          </div>

          <p>
            <button className="button">
              Sign up
            </button>
          </p>

          <Errors errors={this.state.errors} />

          <p className={FormStyles.note}>
            <span>Already have an account, </span>
            <Link to="/sign-in">sign in</Link>.
          </p>
        </Form>

      </Middle>
    );
  }

}


SignUpPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default connect()(SignUpPage);
