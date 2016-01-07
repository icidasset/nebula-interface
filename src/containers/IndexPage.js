import { createElement, Component } from 'react';

import Message from '../components/Message';
import Middle from '../components/Middle';


class IndexPage extends Component {

  render() {
    return (
      <Middle>
        <Message icon="flash">
          Redirecting
        </Message>
      </Middle>
    );
  }

}


export default IndexPage;
