import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';

import Button from 'react-mdl/lib/Button'
import Textfield from 'react-mdl/lib/Textfield'

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Middle from '../components/Middle';

import { overrideTextFieldValidation } from '../utils/mdl';


class SignUpPage extends Component {

  componentDidMount() {
    this.initiateMDLOverride();
  }

  render() {
    return (
      <Middle>

        <h2>Sign Up</h2>

        <Form>
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
              minLength={6}
            />
          </div>

          <div>
            <Button raised={true} colored={true}>Sign up</Button>
          </div>
        </Form>

      </Middle>
    );
  }

  initiateMDLOverride() {
    let nodes = ["email", "password"].map((ref) => {
      return findDOMNode(this.refs[ref])
    });

    overrideTextFieldValidation(nodes);
  }

}


export default SignUpPage;
