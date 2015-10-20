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

import actions from '../actions';
import { overrideTextFieldValidation } from '../utils/mdl';


class SignInPage extends Component {

  componentDidMount() {
    this.initiateMDLOverride();
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
              floatingLabel={true}
              required={true}
            />

            <Textfield
              ref="password"
              type="password"
              label="Password"
              floatingLabel={true}
              required={true}
            />
          </div>

          <p>
            <Button raised={true} colored={true}>Sign in</Button>
          </p>

          <p>
            <span>Don't have an account yet, </span>
            <Link to="/sign-up">sign up</Link>.
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

    this.props.actions.authenticate(credentials).then(
      () => this.props.actions.goTo('/app'),
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


SignInPage.propTypes = {
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {};
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInPage);
