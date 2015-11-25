import pick from 'lodash/object/pick';
import { createElement, Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppHeader from '../components/app/Header';
import AppContent from '../components/app/Content';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Middle from '../components/Middle';

import childComponents from '../components/app/children';
import childTypes from '../constants/app/children';

import actions from '../actions';


class AppPage extends Component {

  componentDidMount() {
    this.props.actions.fetchSources().then(
      () => this.props.actions.fetchTracks()
    ).then(
      () => this.props.actions.processSources()
    );
  }


  isLoading() {
    return (
      this.props.sources.isFetching ||
      this.props.tracks.isFetching
    );
  }


  /// Render
  ///
  renderMainContent() {
    const childRoute = this.props.routing.path.split('/')[2];

    // child
    if (childRoute && childTypes[childRoute]) {
      let props;

      switch (childTypes[childRoute]) {
      case 'Sources':
        props = ['sources'];
        break;
      default:
        props = [];
      }

      return createElement(
        childComponents[childTypes[childRoute]],
        pick(this.props, ['actions', 'routing'].concat(props))
      );
    }

    // empty
    if (this.props.tracks.items.length === 0) {
      return (
        <Middle>
          <Message icon="change_history">
            Nothing here yet.
          </Message>
        </Middle>
      );
    }

    // default
    return (<childComponents.Tracks tracks={this.props.tracks} />);
  }


  render() {
    if (this.isLoading()) {
      return (<Loader />);
    }

    return (
      <div>
        <AppHeader
          actions={this.props.actions}
          audio={this.props.audio}
          queue={this.props.queue}
        />

        <AppContent>
          {this.renderMainContent()}
        </AppContent>
      </div>
    );
  }

}


AppPage.propTypes = {
  actions: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['audio', 'queue', 'routing', 'sources', 'tracks']);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(AppPage);
