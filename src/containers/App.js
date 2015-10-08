import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';

import actions from '../actions';


class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(actions.sources.processSources());
  }

  render() {
    return (
      <main>
        <Header />
        {this.props.children}
      </main>
    );
  }

}


App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};


function mapStateToProps() { // (state) {}
  return {};
}


export default connect(mapStateToProps)(App);
