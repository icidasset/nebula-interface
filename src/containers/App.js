import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';
import base from '../constants/firebase';
import { pages } from './index';


class App extends Component {

  componentDidMount() {
    // TODO:
    // - Store sources on Firebase
    // - Store tracks on Firebase
    // - Store collections on Firebase
    //
    // - When one of those changes in the Redux store, save data on Firebase (sync)
    // - Initial fetch (or sync) of all data
    // - After initial fetch hide loading animation (this.props.showLoader)

    this.authenticate().then(() => {
      this.props.actions.goTo(window.location.pathname);
      // this.props.actions.processSources();
      // this.props.actions.fetchTracks();
    });
  }


  authenticate() {
    return new Promise((resolve, reject) => {

      base.onAuth((authData) => {
        let promise;

        if (authData) {
          promise = this.props.actions.authenticate(authData);
        } else {
          promise = Promise.resolve();
        }

        promise
          .then(this.props.actions.passInitialAuthCheck, reject)
          .then(resolve, reject);
      });

    });
  }


  render() {
    if (!this.props.auth.passedInitialCheck) {
      return (<div>Loading user session.</div>);
    } else if (this.props.routing.container) {
      return React.createElement( pages[this.props.routing.container] );
    } else {
      return (<div />);
    }
  }

}


App.propTypes = {
  auth: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    auth: state.auth,
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
