import React, { Component } from 'react';
import { Link } from 'react-router';


class SignInPage extends Component {

  render() {
    return (
      <p>
        Sign in Page!
        <br />
        <Link to={'/app'}>Go to the app</Link>
      </p>
    );
  }

}


export default SignInPage;
