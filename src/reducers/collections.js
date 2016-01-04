import flatten from 'lodash/array/flatten';
import sortBy from 'lodash/collection/sortBy';

import * as types from '../constants/action_types/collections';


const initialCollection = {
  name: 'Untitled',

  tracksIds: [],
  isGenerated: false,
};


const initialState = {
  isFetching: false,

  allTrackIds: [],
  items: [],
};


export default function tracks(state = initialState, action) {
  let newItems;

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
    newItems = state.items.filter((item) => item.uid !== action.uid);

    return {
      ...state,
      ...gatherItems(newItems),
      allTrackIds: collectAllTrackIds(newItems),
    };


  case types.FETCH_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };


  case types.FETCH_COLLECTIONS_DONE:
    newItems = action.items || [];

    return {
      ...state,
      ...gatherItems(newItems),
      allTrackIds: collectAllTrackIds(newItems),
      isFetching: false,
    };


  case types.UPDATE_COLLECTION_TRACKS:
    return {
      ...state,
      allTrackIds: collectAllTrackIds(state.items),
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


function collectAllTrackIds(items) {
  return flatten(items.map((i) => i.trackIds || []));
}
