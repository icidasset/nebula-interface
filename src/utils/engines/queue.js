import * as actions from '../../actions/queue';
import * as reduxUtils from '../redux';


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

    // tracks.items
    reduxUtils.observeStore(
      this.store,
      (s) => s.tracks.items,
      () => {
        this.store.dispatch(actions.refreshQueue());
      }
    );

    // tracks.filteredItemIds
    reduxUtils.observeStore(
      this.store,
      (s) => s.tracks.filteredItemIds,
      () => {
        this.store.dispatch(actions.resetQueue());
      }
    );
  }

}
