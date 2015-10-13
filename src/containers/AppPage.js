import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from '../components/app/Header';
import Tracks from '../components/app/Tracks';
import SoundPanel from '../components/app/SoundPanel';


class AppPage extends Component {

  render() {
    return (
      <div className="mdl-layout mdl-js-layout">
        <Header />

        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Title</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="">Link</a>
            <a className="mdl-navigation__link" href="">Link</a>
            <a className="mdl-navigation__link" href="">Link</a>
            <a className="mdl-navigation__link" href="">Link</a>
          </nav>
        </div>

        <main className="mdl-layout__content">
          <div className="page-content">
            <Tracks />
          </div>
        </main>

        <SoundPanel />
      </div>
    );
  }

}


export default AppPage;
