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

    dispatch(notificationActions.addNotification({
      message: `Added "${track.properties.title}" to the "${collection.name}" collection`,
      level: 'success',
    }));

    collection.trackIds = collection.trackIds || [];
    collection.trackIds.push(trackUtils.generateTrackId(track));

    return firebase.update(
      'collections',
      collection.uid,
      { trackIds: collection.trackIds},
      state.auth.user.uid,
    );

    // TODO: check if it isn't already in the collection
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
