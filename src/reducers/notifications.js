import * as types from '../constants/action_types/notifications';


const initialState = {
  items: [],
};


export default function notifications(state = initialState, action) {
  switch (action.type) {

  case types.ADD_NOTIFICATION:
    return {
      ...state,
      items: [ ...state.items, action.notification ],
    };


  case types.CLEAR_NOTIFICATIONS:
    return {
      ...state,
      items: [],
    };


  case types.REMOVE_NOTIFICATION:
    return {
      ...state,
      items: state.items.filter((i) => i.uid !== action.uid),
    };


  default:
    return state;
  }
}
