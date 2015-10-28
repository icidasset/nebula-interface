import * as types from '../constants/action_types/auth';
import base from '../constants/firebase';


/// Actions
///
export function createUser(credentials) {
  return () => {
    return new Promise((resolve, reject) => {

      // create user with email & password
      // -> return promise with data
      base.createUser(credentials, (error, userData) => {
        if (error) reject(error);
        else resolve(userData);
      });

    });
  };
}

export function performInitialAuthCheck() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      // check if the user is authenticated
      // -> return promise
      base.onAuth((authData) => {
        let promise;

        if (authData) promise = dispatch(authenticate(authData));
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
      // 1. authenticate with credentials
      if (args.email) {
        base.authWithPassword(args, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            dispatch({ type: types.AUTHENTICATE, user: authData });
            resolve(authData);
          }
        });

      // 2. authenticate with firebase data
      } else {
        dispatch({ type: types.AUTHENTICATE, user: args });
        resolve(args);

      }

    });
  };
}

export function deauthenticate() {
  return (dispatch) => {

    // deauthenticate user
    base.unauth();
    dispatch({ type: types.DEAUTHENTICATE });

  };
}

export function resetPassword(email) {
  return () => {
    return new Promise((resolve, reject) => {

      // send password reset email
      // -> return promise
      base.resetPassword({ email }, (error) => {
        if (error) reject(error);
        else resolve();
      });

    });
  };
}
