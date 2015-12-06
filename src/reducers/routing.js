import * as types from '../constants/action_types/routing';


const initialState = {
  container: undefined,
  path: undefined,
  status: 200,
};


export default function routing(state = initialState, action) {
  switch (action.type) {
  case types.SET_CONTAINER:
    return {
      ...state,
      container: action.container,
    };


  case types.SET_PATH:
    return {
      ...state,
      path: action.path,
    };


  case types.SET_STATUS:
    return {
      ...state,
      status: action.status,
    };


  default:
    return state;
  }
}
