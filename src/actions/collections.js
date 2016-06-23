import * as firebase from '../utils/firebase';
import * as trackUtils from '../utils/tracks';
import * as types from '../constants/action_types/collections';
import * as notificationActions from './notifications';


/// Actions
///
export function addCollection(attributes) {
  return (dispatch, getState) => {
    const state = getState();

    return firebase.add('collections', attributes, state.auth.user.uid).then(
      (collection) => dispatch({ type: types.ADD_COLLECTION, collection })
    );
  };
}


export function addTrackToCollection(track, collection) {
  return (dispatch, getState) => {
    const state = getState();
    const trackId = trackUtils.generateTrackId(track);

    let changed = false;

    dispatch(notificationActions.addNotification({
      message: `Added "${track.properties.title}" to your "${collection.name}" collection`,
      level: 'success',
    }));

    if (!collection.trackIds) {
      collection.trackIds = [];
      changed = true;
    }

    if (collection.trackIds.indexOf(trackId) === -1) {
      collection.trackIds.push(trackId);
      changed = true;
    }

    if (changed) {
      dispatch({ type: types.UPDATE_COLLECTION_TRACKS });

      return firebase.update(
        'collections',
        collection.uid,
        { trackIds: collection.trackIds },
        state.auth.user.uid,
      );
    }
  };
}


export function removeTrackFromCollection(track, collection) {
  return (dispatch, getState) => {
    const state = getState();
    const trackId = trackUtils.generateTrackId(track);

    dispatch(notificationActions.addNotification({
      message: `Removed "${track.properties.title}" from your "${collection.name}" collection`,
      level: 'success',
    }));

    const idx = collection.trackIds.indexOf(trackId);

    if (idx > -1) {
      collection.trackIds.splice(idx, 1);

      dispatch({ type: types.UPDATE_COLLECTION_TRACKS });

      return firebase.update(
        'collections',
        collection.uid,
        { trackIds: collection.trackIds },
        state.auth.user.uid,
      );
    }
  };
}


export function checkIfTrackIsInCollection(track, collection) {
  return () => {
    const trackId = trackUtils.generateTrackId(track);
    return (collection.trackIds || []).indexOf(trackId) !== -1;
  };
}


export function deleteCollection(uid) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.DELETE_COLLECTION, uid });
    return firebase.remove('collections', uid, state.auth.user.uid);
  };
}


export function fetchCollections() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.FETCH_COLLECTIONS });

    return firebase.fetch('collections', state.auth.user.uid, {}, state.connection.offline).then(
      (result) => {
        const items = firebase.convertPushedToArray(result);
        dispatch({ type: types.FETCH_COLLECTIONS_DONE, items });
      }
    );
  };
}


export function setSpecialCollection(type, items) {
  return { type: types.SET_SPECIAL_COLLECTION, specialType: type, items };
}


export function updateCollection(uid, attributes) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.UPDATE_COLLECTION, uid, attributes });

    return firebase.update('collections', uid, attributes, state.auth.user.uid);
  };
}
