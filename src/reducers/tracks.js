import sortByAll from 'lodash/collection/sortByAll';

import * as trackUtils from '../utils/tracks';
import * as types from '../constants/action_types/tracks';


const initialTrack = {
  path: null,
  sourceUid: null,

  properties: {
    album: 'Unknown',
    artist: 'Unknown',
    genre: 'Unknown',
    title: 'Unknown',
    year: 'Unknown',

    track: 1,
  },
};


const initialState = {
  collection: false,
  filter: (typeof importScripts !== 'function') ?
    (localStorage.getItem('tracksFilter') || '') :
    (''),

  isFetching: false,

  // NOTE:
  // ! FILTERED-ITEMS AND FILTERED-ITEM-IDS
  // ! MUST BE IN THE SAME ORDER
  filteredItems: [],
  filteredItemIds: [],
  items: [],
};


export function makeTrackObject(attributes) {
  return {
    sourceUid: attributes.sourceUid,
    path: attributes.path,
    properties: { ...initialTrack.properties, ...attributes.properties },
  };
}


export default function tracks(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_TRACKS:
    return {
      ...state,
      isFetching: true,
    };


  case types.FETCH_TRACKS_DONE:
    cleanUpItems(action.items);

    return {
      ...state,
      ...gatherItems(action.items, {
        collection: state.collection,
        filter: state.filter,
      }),
      isFetching: false,
    };


  case types.FILTER_TRACKS:
    localStorage.setItem('tracksFilter', action.value);

    return {
      ...state,
      ...gatherItems(state.items, {
        collection: state.collection,
        filter: action.value,
        filteredOnly: true,
      }),
      filter: action.value,
    };


  case types.REPLACE_TRACKS:
    return {
      ...state,
      ...gatherItems(action.items, {
        collection: state.collection,
        filter: state.filter,
      }),
    };


  case types.SET_ACTIVE_COLLECTION:
    return {
      ...state,
      ...gatherItems(state.items, {
        collection: action.collection,
        filter: state.filter,
      }),
      collection: action.collection,
    };


  default:
    return state;
  }
}


function gatherItems(items, options = {}) {
  const filtered = runThroughFilter(items, options.filter);
  const sorted = sortByAll(filtered, [
    'properties.artist',
    'properties.album',
    'properties.track',
    'properties.title',
    'path',
  ]);

  const result = {
    filteredItems: sorted,
    filteredItemIds: sorted.map(trackUtils.generateTrackId),
  };

  if (!options.filteredOnly) {
    Object.assign(result, { items: [...items] });
  }

  return result;
}


function runThroughFilter(items, filter) {
  if (!filter || !filter.length) {
    return [...items];
  }

  const r = new RegExp(filter.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  const checkAttr = ['title', 'artist', 'album'];

  return items.filter((item) => {
    let isMatch = false;

    for (let i = 0, j = checkAttr.length; i < j; i++) {
      const m = r.test(item.properties[checkAttr[i]]);
      if (m) { isMatch = true; break; }
    }

    return isMatch;
  });
}


function cleanUpItems(items) {
  items.forEach((item) => {
    if (!item.properties.title) item.properties.title = 'Unknown';
    if (!item.properties.artist) item.properties.artist = 'Unknown';
    if (!item.properties.album) item.properties.album = 'Unknown';
  });
}
