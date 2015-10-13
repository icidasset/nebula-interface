import * as types from '../constants/action_types/tracks';
import base from '../constants/firebase';


export function fetchTracks() {
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_TRACKS });

    base.fetch('tracks', {
      context: this,
      then: function(data) {
        setTimeout(() => dispatch({ type: types.FETCH_TRACKS_DONE }), 5000);
      }
    });
  };
}


export function addTrack(attributes) {
  return { type: types.ADD_TRACK, attributes };
}
