import * as types from '../constants/action_types/collections';


const initialCollection = {
  name: 'Untitled',

  tracksIds: [],
  isGenerated: false,
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
        { ...initialCollection, ...action.collection },
      ],
    };


  case types.DELETE_COLLECTION:
    return {
      ...state,
      items: state.items.filter((item) => item.uid !== action.uid),
    };


  case types.FETCH_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };


  case types.FETCH_COLLECTIONS_DONE:
    return {
      ...state,
      isFetching: false,
      items: action.items || [],
    };


  default:
    return state;
  }
}
