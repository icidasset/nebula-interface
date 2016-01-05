import Firebase from 'firebase';


let base;
let origin;
let invalidLocal;


function check() {
  const local = localStorage.getItem('firebaseUrl');
  const env = ENV.FIREBASE_URL;

  if (local && local !== invalidLocal) {
    if (origin !== 'local') {
      try {
        base = new Firebase(local);
        origin = 'local';
      } catch (e) {
        console.error('Invalid Firebase url given, using default (fallback).');
        invalidLocal = local;
        base = new Firebase(env);
        origin = 'env';
      }
    }
  } else if (origin !== 'env') {
    base = new Firebase(env);
    origin = 'env';
  }

  return base;
}


check();


export default function() {
  return check();
}
