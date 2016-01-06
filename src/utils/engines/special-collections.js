import compact from 'lodash/array/compact';
import uniq from 'lodash/array/uniq';

import * as actions from '../../actions/collections';
import * as reduxUtils from '../redux';


/// Public
///
export function initialize(store) {
  return new SpecialCollectionsEngine(store);
}


/// Private
///
class SpecialCollectionsEngine {

  constructor(store) {
    this.store = store;

    // tracks.items
    reduxUtils.observeStore(
      this.store,
      (s) => s.tracks.items,
      (tracks) => {
        this.store.dispatch(actions.setSpecialCollection(
          'directory',
          this.generateDirectories(tracks)
        ));
      }
    );

    // sources.items
    reduxUtils.observeStore(
      this.store,
      (s) => s.sources.items,
      () => {
        this.store.dispatch(actions.setSpecialCollection(
          'directory',
          this.generateDirectories(
            this.store.getState().tracks.items
          )
        ));
      }
    );
  }


  generateDirectories(tracks) {
    const state = this.store.getState();
    const sourceUids = [];

    state.sources.items.forEach((source) => {
      if (source.settings.directoryCollections === true) {
        sourceUids.push(source.uid);
      }
    });

    return uniq(compact(
      tracks.filter((t) => {
        return sourceUids.indexOf(t.sourceUid) !== -1;
      }).map((t) => {
        const s = t.path.split('/');
        if (s.length > 1) return s[0];
      })
    ));
  }

}
