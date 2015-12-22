import * as actions from '../../actions/connection';


export function initialize(store) {
  if (navigator.onLine) {
    store.dispatch(actions.goOnline());
  } else {
    store.dispatch(actions.goOffline());
  }

  window.addEventListener('offline', () => store.dispatch(actions.goOffline()), false);
  window.addEventListener('online', () => store.dispatch(actions.goOnline()), false);
}
