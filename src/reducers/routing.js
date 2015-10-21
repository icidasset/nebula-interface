import * as types from '../constants/action_types/routing';


const initialState = {
  container: undefined,
  path: undefined,
  status: 200,
};


export default function routing(state = initialState, action) {
  switch (action.type) {
  case types.SET_PATH:
    return Object.assign({}, state, {
      path: action.path,
    });

  case types.SET_STATUS:
    return Object.assign({}, state, {
      status: action.status,
    });

  case types.SET_CONTAINER:
    return Object.assign({}, state, {
      container: action.container,
    });

  default:
    return state;
  }
}
