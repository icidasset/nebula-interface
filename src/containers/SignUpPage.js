import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import * as actions from '../actions/auth';
import { overrideTextFieldValidation } from '../utils/mdl';


class SignUpPage extends Component {

  componentDidMount() {
    this.initiateMDLOverride();
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).querySelector('input').value,
      password: findDOMNode(this.refs.password).querySelector('input').value,
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


  initiateMDLOverride() {
    const nodes = ['email', 'password'].map((ref) => {
      return findDOMNode(this.refs[ref]);
    });

    overrideTextFieldValidation(nodes);
  }


  render() {
    return (
      <Middle>

        <h2>Sign Up</h2>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <Textfield
              ref="email"
              type="email"
              label="Email"
              floatingLabel
              required
            />

            <Textfield
              ref="password"
              type="password"
              label="Password"
              floatingLabel
              required
              minLength={5}
            />
          </div>

          <p>
            <Button raised colored>Sign up</Button>
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
