import * as types from '../constants/action_types/connection';


const initialState = {
  offline: true,
};


export default function connection(state = initialState, action) {
  switch (action.type) {
  case types.GO_OFFLINE:
    return {
      ...state,
      offline: true,
    };


  case types.GO_ONLINE:
    return {
      ...state,
      offline: false,
    };


  default:
    return state;
  }
}
