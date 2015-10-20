import React, { Component } from 'react';

import Button from 'react-mdl/lib/Button'
import Textfield from 'react-mdl/lib/Textfield'

import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Middle from '../components/Middle';


class SignInPage extends Component {

  render() {
    return (
      <Middle>

        <h2>Sign in</h2>

        <Form>
          <div className={FormStyles.inputs}>
            <Textfield
              label="Email"
              floatingLabel={true}
            />

            <Textfield
              label="Password"
              floatingLabel={true}
            />
          </div>

          <div>
            <Button raised={true} colored={true}>Sign in</Button>
          </div>
        </Form>

      </Middle>
    );
  }

}


export default SignInPage;
