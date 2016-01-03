import * as actions from '../../actions/queue';


/// Public
///
export function initialize(store) {
  return new QueueEngine(store);
}


/// Private
///
class QueueEngine {

  constructor(store) {
    this.store = store;
    this.store.subscribe(this.storeChangeHandler.bind(this));
    this.lastState = { tracks: { items: null } };
  }


  storeChangeHandler() {
    const state = this.store.getState();

    // check if the state, that we need, changed
    if (state.tracks.items === this.lastState.tracks.items) return;
    this.lastState.tracks.items = state.tracks.items;

    // it's all good
    this.store.dispatch(actions.refreshQueue());
  }

}
