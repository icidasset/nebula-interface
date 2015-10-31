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


export function save(key, items, userId) {
  return new Promise((resolve, reject) => {
    base.child(`${key}/${userId}`)
        .set(items, promiseCallback(resolve, reject));
  });
}
