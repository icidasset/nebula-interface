import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import actions from '../actions';


class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.dispatch(actions.sources.processSources());
    this.props.dispatch(actions.tracks.fetchTracks());

    // TODO:
    // - Store sources on Firebase
    // - Store tracks on Firebase
    // - Store collections on Firebase
    //
    // - When one of those changes in the Redux store, save data on Firebase (sync)
    // - Initial fetch (or sync) of all data
    // - After initial fetch hide loading animation (this.props.showLoader)
  }

  render() {
    return this.props.children;
  }

}


App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};


export default connect()(App);
