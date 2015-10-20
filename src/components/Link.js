import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as routingActions from '../actions/routing';


class Link extends Component {

  handleClick(event) {
    if (!this.props.external) {
      this.props.actions.goTo(this.props.to);
      event.preventDefault();
    }
  }

  render() {
    let href = this.props.to;

    // TODO: make href relative

    return (
      <a href={href} onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </a>
    );
  }

}


Link.propTypes = {
  to: PropTypes.string.isRequired,
};


function mapStateToProps(state) {
  return {};
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(routingActions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);
