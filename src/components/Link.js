import { createElement, Component, PropTypes } from 'react';
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
    const href = this.props.to;

    // className
    const classNames = [];

    if (this.props.routing.path === this.props.to) {
      classNames.push('is-active');
    }

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    // render
    return (
      <a href={href} className={classNames.join(' ')} onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </a>
    );
  }

}


Link.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  external: PropTypes.bool,
  routing: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
};


function mapStateToProps(state) {
  return {
    routing: state.routing,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(routingActions, dispatch),
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);
