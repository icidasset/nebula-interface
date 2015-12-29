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


  renderChild() {
    if (!this.props.auth.passedInitialCheck) {
      return (<Loader />);
    } else if (this.props.routing.container) {
      return createElement( pages[this.props.routing.container] );
    }

    return '';
  }


  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.renderChild()}
        {this.props.children}
      </div>
    );
  }

}


App.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, [ 'auth', 'routing' ]);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
