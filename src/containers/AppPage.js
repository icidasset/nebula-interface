import pick from 'lodash/object/pick';
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/app/Header';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Middle from '../components/Middle';
import SoundPanel from '../components/app/SoundPanel';

import childComponents from '../components/app/children';
import childTypes from '../constants/app/children';

import actions from '../actions';
import styles from './AppPage.scss';


@CSSModules(styles)
class AppPage extends Component {

  componentDidMount() {
    this.props.actions.fetchSources().then(
      () => this.props.actions.fetchTracks()
    ).then(
      () => this.props.actions.processSources()
    );
  }


  getMainContent() {
    const childRoute = this.props.routing.path.split('/')[2];

    // render child-view based on route
    if (childRoute && childTypes[childRoute]) {
      let props;

      switch (childTypes[childRoute]) {
      case 'Sources':
        props = ['sources'];
        break;
      default:
        props = [];
      }

      return React.createElement(
        childComponents[childTypes[childRoute]],
        pick(this.props, ['actions', 'routing'].concat(props))
      );
    }

    // if no sources or tracks
    if (this.props.tracks.items.length === 0) {
      return (
        <Middle>
          <Message icon="new_releases">
            Nothing here yet, add some music first.
          </Message>
        </Middle>
      );
    }

    // render tracks child-view (i.e. the default view)
    return (<childComponents.Tracks tracks={this.props.tracks} />);
  }


  render() {
    if (this.props.sources.isFetching ||
        this.props.tracks.isFetching) {
      return (<Loader />);
    }

    return (
      <div>
        <Header />

        <main styleName="main">
          {this.getMainContent()}
        </main>

        <SoundPanel />
      </div>
    );
  }

}


AppPage.propTypes = {
  actions: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['routing', 'sources', 'tracks']);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(AppPage);
