import React, { Component } from 'react';
import { Link } from 'react-router';


class IndexPage extends Component {

  render() {
    return (
      <p>
        Index Page!
        <br />
        <Link to={'/sign-in'}>Go to sign-in</Link>
      </p>
    );
  }

}


export default IndexPage;
