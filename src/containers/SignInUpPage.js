import pick from 'lodash/object/pick';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Errors from '../components/Errors';
import Form from '../components/Form';
import FormStyles from '../components/Form.scss';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';


class SignInUpPage extends Component {

  constructor(props) {
    super(props);

    this.setInitialState(this.props);
  }


  componentWillReceiveProps(nextProps) {
    this.setInitialState(nextProps);
  }


  setInitialState(props) {
    this.state = {
      isSignUp: (props.routing.path === '/sign-up'),
      errors: [],
    };
  }


  handleSubmit(event) {
    const credentials = {
      email: findDOMNode(this.refs.email).value,
      password: findDOMNode(this.refs.password).value,
    };

    if (this.state.isSignUp) {
      // create user and log him/her in
      this.props.dispatch(actions.createUser(credentials)).then(
        () => this.props.dispatch(actions.authenticate(credentials)),
        (error) => { this.setState({ errors: [error.toString()] }); this.render(); }
      );

    } else {
      // authenticate user and go to the app page
      this.props.dispatch(actions.authenticate(credentials)).then(
        () => this.props.dispatch(actions.goTo('/app')),
        (error) => { this.setState({ errors: [error.toString()] }); this.render(); }
      );

    }

    event.preventDefault();
  }


  render() {
    const label =
      `Sign ${this.state.isSignUp ? 'Up' : 'In'}`;

    const labelExtra = (
      <span>
        { label.split(' ')[0] }
        <strong> { label.split(' ').reverse()[0] }</strong>
      </span>
    );

    const note = (
      this.state.isSignUp ? (
        <p className={FormStyles.note}>
          <span>Already have an account, </span>
          <Link to="/sign-in">sign in</Link>.
        </p>
      ) : (
        <p className={FormStyles.note}>
          <span>Don't have an account yet, </span>
          <Link to="/sign-up">sign up</Link>.
        </p>
      )
    );

    return (
      <Middle>

        <h1>
          <i className="material-icons">perm_identity</i>
          {labelExtra}
        </h1>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className={FormStyles.inputs}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref="email" placeholder="user@email.com" autoFocus required />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref="password" placeholder="••••••••" minLength={5} required />
            </div>
          </div>

          <p><button className="button">{label}</button></p>
          <Errors errors={this.state.errors} />
          {note}
        </Form>

      </Middle>
    );
  }

}


SignInUpPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  routing: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['routing']);
}


export default connect(mapStateToProps)(SignInUpPage);
