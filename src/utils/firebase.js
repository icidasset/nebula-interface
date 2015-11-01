import isArray from 'lodash/lang/isArray';

import base from '../constants/firebase';


export function promiseCallback(resolve, reject) {
  return function firebaseCallback(error) {
    if (error) reject(error);
    else resolve();
  };
}


export function fetch(key, userId) {
  return new Promise((resolve, reject) => {
    base.child(`${key}/${userId}`).on(
      'value',
      (snapshot) => resolve(snapshot.val()),
      (error) => reject(error)
    );
  });
}


export function add(key, arg, userId) {
  if (isArray(arg)) return addMultiple(key, arg, userId);
  return addSingle(key, arg, userId);
}


export function remove(key, uid, userId) {
  return new Promise((resolve, reject) => {
    base.child(`${key}/${userId}/${uid}`)
        .remove(promiseCallback(resolve, reject));
  });
}


export function convertPushedToArray(pushed = {}) {
  return Object.keys(pushed).map((key) => {
    return Object.assign({ uid: key }, pushed[key]);
  });
}


/// Private
///
function addSingle(key, item, userId) {
  return new Promise((resolve, reject) => {
    const ref = base.child(`${key}/${userId}`);
    const newRef = ref.push();

    newRef.set(item, promiseCallback(
      () => resolve(Object.assign({ uid: newRef.key() }, item)),
      reject
    ));
  });
}


function addMultiple(key, items, userId) {
  return Promise.all(items.map((item) => addSingle(key, item, userId)));
}
