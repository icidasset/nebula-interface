import sortBy from 'lodash/collection/sortBy';

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
      ...gatherItems([
        ...state.items,
        { ...initialCollection, ...action.collection },
      ]),
    };


  case types.DELETE_COLLECTION:
    return {
      ...state,
      ...gatherItems(
        state.items.filter((item) => item.uid !== action.uid)
      ),
    };


  case types.FETCH_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };


  case types.FETCH_COLLECTIONS_DONE:
    return {
      ...state,
      ...gatherItems(action.items || []),
      isFetching: false,
    };


  default:
    return state;
  }
}


/// Private
///
function gatherItems(items) {
  const sorted = sortBy(items, 'name');

  return {
    items: sorted,
  };
}
