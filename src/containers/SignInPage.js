import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';


class SignInPage extends Component {

  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).value,
      password: findDOMNode(this.refs.password).value,
    };

    // authenticate user and go to the app page
    this.props.dispatch(actions.authenticate(credentials)).then(
      () => this.props.dispatch(actions.goTo('/app')),
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

        <h1>Sign in</h1>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <div>
              <input type="email" id="email" ref="email" placeholder="example@email.com" required />
              <label htmlFor="email">Email</label>
            </div>

            <div>
              <input type="password" id="password" ref="password" placeholder="password" required />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <p>
            <button className="button">
              Sign in
            </button>
          </p>

          <p>
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
