import { createHistory } from 'history';

import * as routingActions from '../actions/routing';
import * as statusCodes from '../constants/status_codes';


const history = createHistory();


/// Public
///
export function initialize(store) {
  return new HistoryEngine(store);
}


/// Private
///
class HistoryEngine {

  constructor(store) {
    this.store = store;
    this.store.subscribe(this.storeChangeHandler);
    this.lastState = { path: null };
  }


  /**
   * Update the document url when the (redux) path changes
   */
  storeChangeHandler() {
    const state = this.store.getState();

    // check if the state, that we need, changed
    if (state.routing.path === this.lastState.path || !state.routing.path) {
      return;
    }

    this.lastState.path = state.routing.path;

    // the path stored in state is always in the form of `/path`
    const windowPath = window.location.pathname.replace(/\/*$/, '');

    // determine document url
    let href = state.routing.path;
    if (href === '/') href = '';

    // set new document url if it differs from the current one
    // do not alter history when the status code equals 208
    if (windowPath !== href && status !== statusCodes.NO_HISTORY) {
      const status = state.routing.status;
      const method = (status === statusCodes.REDIRECT ? 'replace' : 'push') + 'State';
      history[method]({}, href);
    }
  }


  /**
   * When history changes update the (redux) path
   */
  listen() {
    history.listen((location) => {
      if (location.action === 'POP') {
        store.dispatch(routingActions.goTo(location.pathname, statusCodes.NO_HISTORY));
      }
    });
  }

}
