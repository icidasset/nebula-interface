import pick from 'lodash/object/pick';
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';

import Header from '../components/app/Header';
import Loader from '../components/Loader';
import SoundPanel from '../components/app/SoundPanel';

import childComponents from '../components/app/children';
import childTypes from '../constants/app/children';

import styles from './AppPage.scss';


@CSSModules(styles)
class AppPage extends Component {

  constructor(props) {
    super(props);
    this.setStartState(this.props);
  }


  componentWillReceiveProps(nextProps) {
    this.setStartState(nextProps);
  }


  setStartState(props) {
    const childRoute = props.routing.path.split('/')[2];
    let childRouteViewClassName;

    // determine child-view-class
    if (childRoute && childTypes[childRoute]) {
      childRouteViewClassName = childTypes[childRoute];
    }

    // set state
    this.state = Object.assign({}, this.state, {
      childRouteViewClassName,
    });
  }


  getMainContent() {
    if (this.state.childRouteViewClassName) {
      return React.createElement(childComponents[this.state.childRouteViewClassName]);

    // show loader when necessary
    } else if (this.props.tracks.isFetching) {
      return (<Loader />);

    }

    // render tracks child-view (i.e. the default view)
    return (<childComponents.Tracks tracks={this.props.tracks} />);
  }


  render() {
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
  routing: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['routing', 'tracks']);
}


export default connect(mapStateToProps)(AppPage);
