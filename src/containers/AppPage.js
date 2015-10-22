import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout, { Content, Drawer, Navigation } from 'react-mdl/lib/layout/Layout';

import Header from '../components/app/Header';
import Link from '../components/Link';
import SoundPanel from '../components/app/SoundPanel';


class AppPage extends Component {

  getPageContent() {
    // if (this.props.view === viewTypes.QUEUE) {
    //   return (<div>TODO: Queue</div>);
    //
    // } else if (this.props.tracks.isFetching) {
    //   return (<div>TODO: Load screen ...</div>);
    //
    // } else {
    //   return (<Tracks tracks={this.props.tracks} />);
    //
    // }

    return (<div>TODO: Load screen ...</div>);
  }


  render() {
    const pageContent = this.getPageContent();

    return (
      <Layout>
        <Header />

        <Drawer title="Title">
          <Navigation>
            <a href="#">Settings</a>
            <Link to="/sign-out" className="mdl-navigation__link">Sign out</Link>
          </Navigation>
        </Drawer>

        <Content>
          {pageContent}
        </Content>

        <SoundPanel />
      </Layout>
    );
  }

}


function mapStateToProps(state) {
  return {
    tracks: state.tracks,
    view: state.view,
  };
}


export default connect(mapStateToProps)(AppPage);
