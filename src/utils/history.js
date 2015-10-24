import { createHistory } from 'history';

import * as routingActions from '../actions/routing';
import * as statusCodes from '../constants/status_codes';


const history = createHistory();

let store;


/// Update the document url when the (redux) path changes
///
function subscription() {
  const state = store.getState();
  const status = state.routing.status;
  const method = (status === statusCodes.REDIRECT ? 'replace' : 'push') + 'State';

  // if the current path isn't stored in the state yet, exit
  if (!state.routing.path) return;

  // the path stored in state is always in the form of `/path`
  const windowPath = window.location.pathname.replace(/\/*$/, '');

  // determine document url
  let href = state.routing.path;
  if (href === '/') href = '';

  // set new document url if it differs from the current one
  // do not alter history when the status code equals 208
  if (windowPath !== href && status !== statusCodes.NO_HISTORY) {
    history[method]({}, href);
  }
}


/// When history changes update the (redux) path
///
export function listen() {
  history.listen((location) => {
    if (location.action === 'POP') {
      store.dispatch(routingActions.goTo(location.pathname, statusCodes.NO_HISTORY));
    }
  });
}


/// Initialize
///
export function initialize(storeArg) {
  store = storeArg;
  store.subscribe(subscription);
}
