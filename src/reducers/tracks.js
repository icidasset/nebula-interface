import * as types from '../constants/action_types/tracks';


const initialTrack = {
  title: 'Untitled',
  artist: 'Untitled',

  sourceId: null,
  path: null,
};


const initialState = {
  isFetching: true,

  items: [],
};


export default function tracks(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_TRACKS:
    return Object.assign({}, state, {
      isFetching: true,
    });

  case types.FETCH_TRACKS_DONE:
    return Object.assign({}, state, {
      isFetching: false,
    });

  case types.ADD_TRACK:
    return Object.assign({}, state, {
      items: [
        ...state.items,
        Object.assign({}, initialTrack, action.attributes),
      ],
    });

  default:
    return state;
  }
}
