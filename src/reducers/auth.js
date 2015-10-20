import * as types from '../constants/action_types/auth';


const initialState = {
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

  default:
    return state;
  }
}
