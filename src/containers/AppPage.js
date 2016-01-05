import camelCase from 'lodash/string/camelCase';
import capitalize from 'lodash/string/capitalize';
import pick from 'lodash/object/pick';

import { createElement, Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppHeader from '../components/app/Header';
import AppContent from '../components/app/Content';
import Loader from '../components/Loader';
import childComponents from '../components/app/children';

import actions from '../actions';


class AppPage extends Component {

  componentDidMount() {
    this.props.actions.fetchSources().then(
      () => this.props.actions.fetchCollections()
    ).then(
      () => this.props.actions.restoreATC()
    ).then(
      () => this.props.actions.fetchTracks()
    ).then(
      () => {
        if (this.props.tracks.items.length === 0) {
          if (!localStorage.getItem('has_shown_get_started')) {
            localStorage.setItem('has_shown_get_started', '1');
            return this.props.actions.goTo('/app/help');
          }
        }

        return this.props.actions.processSources();
      }
    );
  }


  isLoading() {
    return (
      this.props.collections.isFetching ||
      this.props.sources.isFetching ||
      this.props.tracks.isFetching
    );
  }


  /// Render
  ///
  renderMainContent() {
    const childRoute = this.props.routing.path.split('/')[2];
    const childComponentName = childRoute ? capitalize(camelCase(childRoute)) : 'Tracks';
    const component = childComponentName ? childComponents[childComponentName] : null;

    if (component) {
      const props = Object.keys(component.propTypes || {});
      return createElement(component, pick(this.props, props));
    }

    return '';
  }


  render() {
    if (this.isLoading()) {
      return (<Loader />);
    }

    return (
      <div className="root__fh-child">
        <AppHeader
          actions={this.props.actions}
          audio={this.props.audio}
          collections={this.props.collections}
          queue={this.props.queue}
          routing={this.props.routing}
          tracks={this.props.tracks}
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
  collections: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['audio', 'collections', 'queue', 'routing', 'sources', 'tracks']);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(AppPage);
