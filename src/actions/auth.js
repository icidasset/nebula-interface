import * as types from '../constants/action_types/auth';
import base from '../constants/firebase';


/// Actions
///
export function createUser(credentials) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      console.log(credentials);

      base.createUser(credentials, function(error, userData) {
        if (error) {
          reject(error);
        } else {
          resolve(userData);
        }
      });

    });
  };
}

export function authenticate(args) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {

      if (args.email) {
        base.authWithPassword(args, function(error, authData) {
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

export function passInitialAuthCheck() {
  return { type: types.PASS_INITIAL_AUTH_CHECK };
}
