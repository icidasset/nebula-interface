import pick from 'lodash/object/pick';
import { createElement, Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loader from '../components/Loader';

import actions from '../actions';
import { pages } from './index';


class App extends Component {

  componentDidMount() {
    this.props.actions.performInitialAuthCheck().then(() => {
      this.props.history.listen();
    });
  }


  render() {
    if (!this.props.auth.passedInitialCheck) {
      return (<Loader />);
    } else if (this.props.routing.container) {
      return createElement( pages[this.props.routing.container] );
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
