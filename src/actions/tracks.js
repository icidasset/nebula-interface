import * as firebase from '../utils/firebase';
import * as trackUtils from '../utils/tracks';
import * as queueActions from './queue';

import * as types from '../constants/action_types/tracks';


/// Actions
///

export function filterTracks(value) {
  return (dispatch) => {
    dispatch({ type: types.FILTER_TRACKS, value });
    dispatch(queueActions.resetQueue());
  };
}


/**
 * Add new items and remove missing,
 * then store them on firebase.
 */
export function diffTracks(diff) {
  return (dispatch, getState) => {
    const state = getState();
    const oldCollection = state.tracks.items;
    const newCollection = handleDiff(oldCollection, diff);

    // if there are changes
    if (newCollection) {
      dispatch({ type: types.REPLACE_TRACKS, items: newCollection });
      return firebase.replace('tracks', JSON.stringify(newCollection), state.auth.user.uid);
    }
  };
}


/**
 * Retrieve items from firebase.
 */
export function fetchTracks() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.FETCH_TRACKS });

    return firebase.fetch('tracks', state.auth.user.uid).then(
      (result) => {
        const items = JSON.parse(result) || [];
        return dispatch({ type: types.FETCH_TRACKS_DONE, items: items });
      }
    );
  };
}


/**
 * Remove matching tracks
 *
 * @param {string} sourceUid
 * @returns {Promise} from Firebase
 */
export function removeTracksBySourceUid(sourceUid) {
  return (dispatch, getState) => {
    const state = getState();
    const oldCollection = state.tracks.items;
    const newCollection = oldCollection.filter((item) => item.sourceUid !== sourceUid);

    // if there are changes
    if (newCollection.length < oldCollection.length) {
      dispatch({ type: types.REPLACE_TRACKS, items: newCollection });
      return firebase.replace('tracks', JSON.stringify(newCollection), state.auth.user.uid);
    }
  };
}


/**
 * Collections
 */

export function setActiveCollection(collection) {
  return { type: types.SET_ACTIVE_COLLECTION, collection };
}


export function setTargetCollection(collection) {
  return { type: types.SET_TARGET_COLLECTION, collection };
}


/// Private
///
function handleDiff(oldCollection, diff) {
  const missingItems = [];
  let newItems = [];

  let newCollection;

  Object.keys(diff).forEach((sourceUid) => {
    const d = diff[sourceUid];

    d.missing.forEach((missingItem) => {
      missingItems.push(trackUtils.generateTrackIdWithAttributes(sourceUid, missingItem));
    });

    if (d.new.length) {
      newItems = newItems.concat(d.new);
    }
  });

  // remove missing tracks
  if (missingItems.length) {
    newCollection = oldCollection.filter((track) => {
      return missingItems.indexOf(trackUtils.generateTrackId(track)) === -1;
    });
  }

  // add new tracks
  if (newItems.length) {
    newCollection = (newCollection || oldCollection).concat(newItems);
  }

  // return
  return newCollection;
}
