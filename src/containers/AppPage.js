import React, { Component } from 'react';
import { Link } from 'react-router';


class AppPage extends Component {

  render() {
    return (
      <p>
        App Page!
        <br />
        <Link to={'/sign-in'}>Go to sign-in</Link>
      </p>
    );
  }

}


export default AppPage;
