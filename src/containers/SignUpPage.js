import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'react-mdl/lib/Button'
import Textfield from 'react-mdl/lib/Textfield'

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import * as authActions from '../actions/auth';
import { overrideTextFieldValidation } from '../utils/mdl';


class SignUpPage extends Component {

  componentDidMount() {
    this.initiateMDLOverride();
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
              floatingLabel={true}
              required={true}
            />

            <Textfield
              ref="password"
              type="password"
              label="Password"
              floatingLabel={true}
              required={true}
              minLength={5}
            />
          </div>

          <p>
            <Button raised={true} colored={true}>Sign up</Button>
          </p>

          <p>
            <span>Already have an account, </span>
            <Link to="/sign-in">sign in</Link>.
          </p>
        </Form>

      </Middle>
    );
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).querySelector('input').value,
      password: findDOMNode(this.refs.password).querySelector('input').value
    };

    this.props.actions.createUser(credentials).then(
      (userData) => this.props.actions.authenticate(credentials),
      (error) => console.error(error)
    );

    event.preventDefault();
  }


  initiateMDLOverride() {
    let nodes = ["email", "password"].map((ref) => {
      return findDOMNode(this.refs[ref])
    });

    overrideTextFieldValidation(nodes);
  }

}


SignUpPage.propTypes = {
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {};
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage);
