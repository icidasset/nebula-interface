import * as types from '../constants/action_types/tracks';
import base from '../constants/firebase';


/// Actions
///
export function fetchTracks() {
  return (dispatch) => {
    dispatch({ type: types.FETCH_TRACKS });

    // retrieve tracks from Firebase
    base.child('tracks').on('value', (snapshot) => {
      const items = snapshot.val();
      dispatch(fetchTracksDone(items));
    });
  };
}

export function saveTracks(tracks) {
  return (dispatch) => {
    dispatch({ type: types.SAVE_TRACKS });

    // save tracks on Firebase
    base.child('tracks').set(tracks);
  };
}

export function addTrack(attributes) {
  return { type: types.ADD_TRACK, attributes };
}


/// Private
///
function fetchTracksDone(items = []) {
  return { type: types.FETCH_TRACKS_DONE, items };
}
