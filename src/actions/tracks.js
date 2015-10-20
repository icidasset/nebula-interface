import * as types from '../constants/action_types/tracks';
import base from '../constants/firebase';


/// Actions
///
export function fetchTracks() {
  return (dispatch, getState) => {
    dispatch({ type: types.FETCH_TRACKS });

    // retrieve tracks from Firebase
    base.fetch('tracks', {
      context: this,
      then: function(data) {
        let items = data;
        dispatch(fetchTracksDone(items));
      }
    });
  };
}

export function saveTracks(tracks) {
  return (dispatch, getState) => {
    dispatch({ type: types.SAVE_TRACKS });

    // save tracks on Firebase
    base.post('tracks', {
      data: tracks
    });
  };
}

export function addTrack(attributes) {
  return { type: types.ADD_TRACK, attributes };
}


/// Private
///
function fetchTracksDone(items=[]) {
  return { type: types.FETCH_TRACKS_DONE, items };
}
