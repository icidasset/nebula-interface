import firebase from 'firebase';
import isArray from 'lodash/lang/isArray';


export function fetch(key, userId, fallback, offline) {
  if (fallback === undefined) {
    throw new Error('utils/firebase.fetch was called without the \'fallback\' argument');
  }

  if (offline === undefined) {
    throw new Error('utils/firebase.fetch was called without the \'offline\' argument');
  }

  return new Promise((resolve, reject) => {
    if (offline) {
      resolve(fallback);
    } else {
      firebase.database().ref(`${key}/${userId}`).on(
        'value',
        snapshot => resolve(snapshot.val() || fallback),
        error => reject(error)
      );
    }
  });
}


export function add(key, arg, userId) {
  if (isArray(arg)) return addMultiple(key, arg, userId);
  return addSingle(key, arg, userId);
}


export function remove(key, uid, userId) {
  return firebase.database().ref().child(`${key}/${userId}/${uid}`).remove();
}


export function replace(key, items, userId) {
  return firebase.database().ref().child(`${key}/${userId}`).set(items);
}


export function update(key, uid, attributes, userId) {
  return firebase.database().ref().child(`${key}/${userId}/${uid}`).update(attributes);
}


export function convertPushedToArray(pushed = {}) {
  return Object.keys(pushed).map((key) => {
    return Object.assign({ uid: key }, pushed[key]);
  });
}


/// Private
///
function addSingle(key, item, userId) {
  const ref = firebase.database().ref(`${key}/${userId}`);
  const newRef = ref.push();

  return newRef.set(item).then(
    () => Object.assign({ uid: newRef.key }, item)
  );
}


function addMultiple(key, items, userId) {
  return Promise.all(items.map((item) => addSingle(key, item, userId)));
}
