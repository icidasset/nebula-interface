import * as types from '../constants/action_types/collections';


const initialCollection = {
  name: 'Untitled',

  tracksIds: [],
};


const initialState = {
  isFetching: false,

  items: [],
};


export default function tracks(state = initialState, action) {
  switch (action.type) {
  case types.ADD_COLLECTION:
    return {
      ...state,
      items: [
        ...state.items,
        { ...initialCollection, ...action.attributes },
      ],
    };

  default:
    return state;
  }
}
