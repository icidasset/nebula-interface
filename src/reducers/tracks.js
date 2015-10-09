import * as types from '../action_types/tracks';


const initialTrack = {
  title: 'Untitled',
  artist: 'Untitled',

  sourceId: null,
  path: null,
};


const initialState = {
  isFetching: false,

  items: []
};


export default function tracks(state = initialState, action) {
  switch (action.type) {
  case types.ADD_TRACK:
    return Object.assign({}, state, {
      items: [
        ...state.items,
        Object.assign({}, initialTrack, action.attributes)
      ]
    });

  default:
    return state;
  }
}
