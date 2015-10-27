import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Errors.scss';


@CSSModules(styles)
class Errors extends Component {

  render() {
    const errors = this.props.errors.map((error, idx) => {
      const err = error.replace('Error: ', '');
      return <li key={idx}><i className="material-icons">error_outline</i> {err}</li>;
    });

    if (errors.length) return (<ul styleName="errors">{errors}</ul>);
  }

}


Errors.propTypes = {
  errors: PropTypes.array.isRequired,
};


export default Errors;
