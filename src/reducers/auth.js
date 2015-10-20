import * as types from '../constants/action_types/auth';


const initialState = {
  passedInitialCheck: false,
  user: undefined
};


export default function auth(state = initialState, action) {
  switch (action.type) {
  case types.AUTHENTICATE:
    return Object.assign({}, state, {
      user: action.user
    });

  case types.DEAUTHENTICATE:
    return Object.assign({}, state, {
      user: undefined
    });

  case types.PASS_INITIAL_AUTH_CHECK:
    return Object.assign({}, state, {
      passedInitialCheck: true
    });

  default:
    return state;
  }
}
