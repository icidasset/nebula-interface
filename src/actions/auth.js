import * as types from '../constants/action_types/auth';


/// Actions
///
export function authenticate() {
  let user = {};
  return { type: types.AUTHENTICATE, user };
}

export function deauthenticate() {
  return { type: types.DEAUTHENTICATE };
}
