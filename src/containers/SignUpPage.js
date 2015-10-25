import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import * as actions from '../actions/auth';


class SignUpPage extends Component {

  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).value,
      password: findDOMNode(this.refs.password).value,
    };

    // create user and log him/her in
    this.props.dispatch(actions.createUser(credentials)).then(
      () => this.props.dispatch(actions.authenticate(credentials)),
      (error) => {
        // TODO: handle error
        console.error(error);
      }
    );

    event.preventDefault();
  }


  render() {
    return (
      <Middle>

        <h1>Sign Up</h1>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <div>
              <input type="email" id="email" ref="email" placeholder="example@email.com" required />
              <label htmlFor="email">Email</label>
            </div>

            <div>
              <input type="password" id="password" ref="password" placeholder="password" minLength={5} required />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <p>
            <button className="button">
              Sign up
            </button>
          </p>

          <p>
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
