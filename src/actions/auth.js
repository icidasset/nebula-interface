import * as types from '../constants/action_types/auth';
import base from '../constants/firebase';


/// Actions
///
export function createUser(credentials) {
  return () => {
    return new Promise((resolve, reject) => {

      base.createUser(credentials, (error, userData) => {
        if (error) {
          reject(error);
        } else {
          resolve(userData);
        }
      });

    });
  };
}

export function performInitialAuthCheck() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      base.onAuth((authData) => {
        let promise;

        if (authData) {
          promise = dispatch(authenticate(authData));
        } else {
          promise = Promise.resolve();
        }

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

      if (args.email) {
        base.authWithPassword(args, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            dispatch({ type: types.AUTHENTICATE, user: authData });
            resolve(authData);
          }
        });

      } else {
        dispatch({ type: types.AUTHENTICATE, user: args });
        resolve(args);

      }

    });
  };
}

export function deauthenticate() {
  return { type: types.DEAUTHENTICATE };
}
