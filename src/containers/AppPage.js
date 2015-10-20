import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout, { Content, Drawer, Navigation } from 'react-mdl/lib/layout/Layout';

import * as viewTypes from '../constants/view_types';

import Header from '../components/app/Header';
import Tracks from '../components/app/Tracks';
import SoundPanel from '../components/app/SoundPanel';


class AppPage extends Component {

  render() {
    let pageContent = this.getPageContent();

    return (
      <Layout>
        <Header />

        <Drawer title="Title">
          <Navigation>
            <a href="#">Settings</a>
            <a href="#">Sign out</a>
          </Navigation>
        </Drawer>

        <Content>
          {pageContent}
        </Content>

        <SoundPanel />
      </Layout>
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
