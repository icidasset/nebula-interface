import camelCase from 'lodash/string/camelCase';
import capitalize from 'lodash/string/capitalize';
import pick from 'lodash/object/pick';

import { createElement, Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppHeader from '../components/app/Header';
import AppContent from '../components/app/Content';

import List from '../components/List';
import Loader from '../components/Loader';
import Middle from '../components/Middle';

import childComponents from '../components/app/children';

import actions from '../actions';


class AppPage extends Component {

  componentDidMount() {
    this.props.actions.fetchSources().then(
      () => this.props.actions.fetchCollections()
    ).then(
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
    const childComponentName = childRoute ? capitalize(camelCase(childRoute)) : null;

    // child
    if (childComponentName) {
      const component = childComponents[childComponentName];
      const props = Object.keys(component.propTypes);

      return createElement(
        component,
        pick(this.props, props)
      );
    }

    // empty
    if (this.props.tracks.items.length === 0) {
      return (
        <Middle>
          <List
            items={[]}
            emptyIcon="beamed-note"
            emptyMessage="No tracks found."
            emptyNote="Click to add a source."
            emptyClickHandler={() => this.props.actions.goTo('/app/sources/add')}
          />
        </Middle>
      );
    }

    // default
    return (
      <childComponents.Tracks
        actions={this.props.actions}
        queue={this.props.queue}
        tracks={this.props.tracks}
      />
    );
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
