import * as firebase from '../utils/firebase';
import * as types from '../constants/action_types/collections';


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

    return firebase.fetch('collections', state.auth.user.uid).then(
      (result) => {
        const items = firebase.convertPushedToArray(result || {});
        dispatch({ type: types.FETCH_COLLECTIONS_DONE, items });
      }
    );
  };
}
