import pick from 'lodash/object/pick';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ComponentWithInfo from '../components/ComponentWithInfo';
import Form from '../components/Form';
import Link from '../components/Link';
import Middle from '../components/Middle';

import actions from '../actions';


class SignInUpPage extends ComponentWithInfo {

  constructor(props) {
    super(props);
    this.setIsSignUpState(this.props);
  }


  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.setIsSignUpState(nextProps);
  }


  setIsSignUpState(props) {
    this.state = Object.assign({}, this.state, {
      isSignUp: (props.routing.path === '/sign-up'),
    });
  }


  createAndAuthenticateUser(credentials) {
    return this.props.actions.createUser(credentials).then(
      () => this.props.actions.authenticate(credentials),
      (error) => this.setInfo('error', error)
    );
  }


  authenticateUser(credentials) {
    return this.props.actions.authenticate(credentials).then(
      () => this.props.actions.goTo('/app'),
      (error) => this.setInfo('error', error)
    );
  }


  handleSubmit() {
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value,
    };

    // sign up/in
    if (this.state.isSignUp) return this.createAndAuthenticateUser(credentials);
    return this.authenticateUser(credentials);
  }


  render() {
    const label = `Sign ${this.state.isSignUp ? 'up' : 'in'}`;
    const labelArray = label.split(' ');

    // note, bottom of form
    const note = (
      this.state.isSignUp ? (
        <span>
          <span>Already have an account, </span>
          <Link to="/sign-in">sign in</Link>.
        </span>
      ) : (
        <span>
          <span>Don't have an account yet, </span>
          <Link to="/sign-up">sign up</Link>.
          <br />
          You can also <Link to="/reset-password">reset your password</Link>.
        </span>
      )
    );

    // input elements
    const inputs = (
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref="email" placeholder="user@email.com" autoFocus required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref="password" placeholder="••••••••" minLength={5} required />
      </div>
    );

    // render
    return (
      <Middle>

        <h1>
          <i className="material-icons">perm_identity</i>
          { labelArray[0] }<strong> { labelArray.reverse()[0] }</strong>
        </h1>

        <Form
          buttonLabel={label}
          info={this.state.info}
          inputs={inputs}
          note={note}
          onSubmit={this.handleSubmit.bind(this)}
        />

      </Middle>
    );
  }

}


SignInUpPage.propTypes = {
  actions: PropTypes.object.isRequired,
  routing: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return pick(state, ['routing']);
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(SignInUpPage);
