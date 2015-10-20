import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Form.scss';


@CSSModules(styles)
class Form extends Component {

  render() {
    return (
      <form styleName="form" onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    );
  }

}


Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};


export default Form;
