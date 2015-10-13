import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as viewTypes from '../constants/view_types';

import Header from '../components/app/Header';
import Tracks from '../components/app/Tracks';
import SoundPanel from '../components/app/SoundPanel';


class AppPage extends Component {

  render() {
    let pageContent = this.getPageContent();

    return (
      <div className="mdl-layout mdl-js-layout">
        <Header />

        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Menu</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="">Sources</a>
            <a className="mdl-navigation__link" href="/sign-out">Sign out</a>
          </nav>
        </div>

        <main className="mdl-layout__content">
          <div className="page-content">
            {pageContent}
          </div>
        </main>

        <SoundPanel />
      </div>
    );
  }


  getPageContent() {
    if (this.props.view === viewTypes.QUEUE) {
      return (<div>TODO: Queue</div>);

    } else if (this.props.tracks.isFetching) {
      return (<div>TODO: Load screen ...</div>);

    } else {
      return (<Tracks tracks={this.props.tracks} />);

    }
  }

}


function mapStateToProps(state) {
  const { tracks, view } = state;

  return {
    tracks,
    view
  };
}


export default connect(mapStateToProps)(AppPage);
