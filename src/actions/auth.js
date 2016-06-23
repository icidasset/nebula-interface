import firebase from 'firebase';
import * as types from '../constants/action_types/auth';


/// Actions
///
export function createUser(credentials) {
  return () => {

    // create user with email & password
    // -> return promise with data
    return firebase.auth().createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

  };
}

export function performInitialAuthCheck() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      // check if the user is authenticated
      // -> return promise
      firebase.auth().onAuthStateChanged(user => {
        let promise;

        if (user) promise = dispatch(authenticate(user));
        else promise = Promise.resolve();

        promise
          .then(() => dispatch({ type: types.PASS_INITIAL_AUTH_CHECK }), reject)
          .then(resolve, reject);
      });

    });
  };
}

export function authenticate(args) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      // authenticate user
      // -> return promise
      //
      // 1. authenticate with firebase data
      if (args.uid) {
        dispatch({ type: types.AUTHENTICATE, user: args });
        resolve(args);

      // 2. authenticate with credentials
      } else if (args.email) {
        firebase.auth().signInWithEmailAndPassword(
          args.email,
          args.password
        ).then(
          user => {
            dispatch({ type: types.AUTHENTICATE, user });
            resolve(user);
          },
          reject
        );

      // otherwise, fail
      } else {
        reject();

      }

    });
  };
}

export function deauthenticate() {
  return (dispatch) => {

    // deauthenticate user
    firebase.auth().signOut();
    dispatch({ type: types.DEAUTHENTICATE });

  };
}

export function resetPassword(email) {
  return () => {

    // send password reset email
    // -> return promise
    return firebase.auth().sendPasswordResetEmail(email);

  };
}

export function updateEmail(newEmail, password) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      // change email
      // -> return promise
      const user = getState().auth.user;
      const oldEmail = user.email;
      const credential = firebase.auth.EmailAuthProvider.credential(oldEmail, password);

      user.reauthenticate(credential)
        .then(() => user.updateEmail(newEmail), reject)
        .then(resolve, reject);

    });
  };
}

export function updatePassword(oldPassword, newPassword) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      // change password
      // -> return promise
      const user = getState().auth.user;
      const oldEmail = user.email;
      const credential = firebase.auth.EmailAuthProvider.credential(oldEmail, oldPassword);

      user.reauthenticate(credential)
        .then(() => user.updatePassword(newPassword), reject)
        .then(resolve, reject);

    });
  };
}
