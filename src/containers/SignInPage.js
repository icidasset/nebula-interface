import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';
import { overrideTextFieldValidation } from '../utils/mdl';


class SignInPage extends Component {

  componentDidMount() {
    this.initiateMDLOverride();
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).querySelector('input').value,
      password: findDOMNode(this.refs.password).querySelector('input').value,
    };

    this.props.dispatch(actions.authenticate(credentials)).then(
      () => this.props.dispatch(actions.goTo('/app')),
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

        <h2>Sign in</h2>

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
            />
          </div>

          <p>
            <Button raised colored>Sign in</Button>
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
