import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { findDOMNode } from 'react-dom';

import Info from '../components/Info';

import styles from './Form.scss';


@CSSModules(styles)
class Form extends Component {

  onSubmit(event) {
    if (this.props.onSubmit) {
      const formEl = findDOMNode(this.refs.form);
      const submitButtonEl = formEl.querySelector('p button');

      // prevent default
      event.preventDefault();

      // check if already disabled
      if (formEl.hasAttribute('disabled')) return;

      // disable
      formEl.setAttribute('disabled', true);
      submitButtonEl.setAttribute('disabled', true);

      // super
      const promise = this.props.onSubmit();

      // undisable
      const undisable = () => {
        formEl.removeAttribute('disabled');
        submitButtonEl.removeAttribute('disabled');
      };

      if (promise) promise.then(undisable);
      else undisable();
    }
  }


  render() {
    return (
      <form styleName="form" ref="form" onSubmit={this.onSubmit.bind(this)}>
        <div styleName="inputs">{this.props.inputs}</div>
        <Info items={this.props.info} />
        <p><button className="button">{this.props.buttonLabel}</button></p>
        <p styleName="note">{this.props.note}</p>
        {this.props.children}
      </form>
    );
  }

}


Form.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  info: PropTypes.array,
  inputs: PropTypes.node.isRequired,
  note: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
};


Form.defaultProps = {
  info: [],
};


export default Form;
