import sortByAll from 'lodash/collection/sortByAll';

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
  filter: (typeof importScripts !== 'function') ?
    (localStorage.getItem('tracksFilter') || '') :
    (''),

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
    return {
      ...state,
      isFetching: true,
    };

  case types.FETCH_TRACKS_DONE:
    cleanUpItems(action.items);

    return {
      ...state,
      ...gatherItems(action.items, state.filter),
      isFetching: false,
    };

  case types.REPLACE_TRACKS:
    return {
      ...state,
      ...gatherItems(action.items, state.filter),
    };

  case types.FILTER_TRACKS:
    localStorage.setItem('tracksFilter', action.value);

    return {
      ...state,
      ...gatherItems(state.items, action.value, true),
      filter: action.value,
    };

  default:
    return state;
  }
}


function gatherItems(items, filter, filteredOnly = false) {
  const filtered = runThroughFilter(items, filter);
  const sorted = sortByAll(filtered, ['artist', 'album', 'track', 'title']);

  const result = {
    filteredItems: sorted,
    filteredItemIds: sorted.map(trackUtils.generateTrackId),
  };

  if (!filteredOnly) {
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
    if (!item.properties.album) item.properties.album = '';
  });
}
