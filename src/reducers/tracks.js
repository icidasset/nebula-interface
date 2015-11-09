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

  items: [],
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
    return Object.assign({}, state, {
      isFetching: false,
      items: action.items,
    });

  case types.REPLACE_TRACKS:
    return Object.assign({}, state, {
      items: action.items,
    });

  default:
    return state;
  }
}
