import * as trackUtils from '../utils/tracks';
import * as types from '../constants/action_types/tracks';


const initialTrack = {
  sourceId: null,
  path: null,

  properties: {
    album: 'Unknown',
    artist: 'Unknown',
    title: 'Unknown',
    genre: 'Unknown',
    year: 'Unknown',

    track: 1,
  },
};


const initialState = {
  isFetching: false,
  filter: '',

  // NOTE:
  // ! FILTERED-ITEMS AND FILTERED-ITEM-IDS
  // ! MUST BE IN THE SAME ORDER
  items: [],
  filteredItems: [],
  filteredItemIds: [],
};


export function makeTrackObject(attributes) {
  return {
    sourceId: attributes.sourceId,
    path: attributes.path,

    properties: Object.assign({}, initialTrack.properties, attributes.properties),
  };
}


export default function tracks(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_TRACKS:
    return Object.assign({}, state, {
      isFetching: true,
    });

  case types.FETCH_TRACKS_DONE:
    return Object.assign(
      {},
      state,
      gatherItems(action.items, state.filter),
      { isFetching: false },
    );

  case types.REPLACE_TRACKS:
    return Object.assign(
      {},
      state,
      gatherItems(action.items, state.filter),
    );

  case types.FILTER_TRACKS:
    return Object.assign(
      {},
      state,
      gatherItems(action.items, action.filter, true),
      { filter: action.filter },
    );

  default:
    return state;
  }
}


function gatherItems(items, filter, filteredOnly = false) {
  const filtered = runThroughFilter(items, filter);
  const result = {
    filteredItems: filtered,
    filteredItemIds: filtered.map(trackUtils.generateTrackId),
  };

  if (!filteredOnly) {
    Object.assign(result, { items: [...items] });
  }

  return result;
}


function runThroughFilter(items) {
  // TODO:
  return [...items];
}
