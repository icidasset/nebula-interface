import pick from 'lodash/object/pick';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loader from '../components/Loader';

import actions from '../actions';
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

    this.props.actions.performInitialAuthCheck().then(() => {
      this.props.history.listen();

      // this.props.actions.processSources();
      // this.props.actions.fetchTracks();
    });
  }


  render() {
    if (!this.props.auth.passedInitialCheck) {
      return (<Loader />);
    } else if (this.props.routing.container) {
      return React.createElement( pages[this.props.routing.container] );
    }

    return (<div />);
  }

}


App.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['auth', 'routing']);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
