import React, { Component } from 'react';

import Link from '../components/Link';
import Middle from '../components/Middle';


class NotFoundPage extends Component {

  render() {
    return (
      <Middle>

        <p>
          ☞ &nbsp;
          <span>Page not found.</span>
          <br />
          <Link to="/sign-in">Sign in</Link>
        </p>

      </Middle>
    );
  }

}


export default NotFoundPage;
