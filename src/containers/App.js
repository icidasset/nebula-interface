import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';
import { pages } from './index';


class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.actions.processSources();
    // this.props.actions.fetchTracks();

    // TODO:
    // - Store sources on Firebase
    // - Store tracks on Firebase
    // - Store collections on Firebase
    //
    // - When one of those changes in the Redux store, save data on Firebase (sync)
    // - Initial fetch (or sync) of all data
    // - After initial fetch hide loading animation (this.props.showLoader)

    this.props.actions.goTo(window.location.pathname);
  }

  render() {
    if (this.props.routing.container) {
      return React.createElement( pages[this.props.routing.container] );
    } else {
      return <div />;
    }
  }

}


App.propTypes = {
  routing: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    routing: state.routing
  };
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
