import groupBy from 'lodash/collection/groupBy';

import * as firebase from '../utils/firebase';
import * as types from '../constants/action_types/sources';


/// Actions
///
export function processSources() {
  return (dispatch, getState) => {
    if (!getState().sources.isProcessing) {
      return dispatch(execProcess());
    }
  };
}

export function addSource(attributes) {
  return (dispatch) => {
    dispatch({ type: types.ADD_SOURCE, attributes });
    dispatch(saveSources());
  };
}


export function fetchSources() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.FETCH_SOURCES });

    return firebase.fetch('sources', state.auth.user.uid).then(
      (items) => dispatch({ type: types.FETCH_SOURCES_DONE, items })
    );
  };
}


/// Private
///
function saveSources() {
  return (dispatch, getState) => {
    const state = getState();
    const sources = state.sources.items;

    dispatch({ type: types.SAVE_SOURCES });

    return firebase.save('sources', sources, state.auth.user.uid);
  };
}

function execProcess() {
  return (dispatch, getState) => {
    const state = getState();
    const sources = state.sources.items;
    const tracksGroupedBySourceId = groupBy(state.tracks.items, 'sourceId');

    // notify 'start'
    dispatch({ type: types.START_PROCESS_SOURCES });

    // process & notify 'end'
    return process(sources, tracksGroupedBySourceId).then(() => {
      dispatch({ type: types.END_PROCESS_SOURCES });
    });
  };
}

function process() {
  /*

    TODO:
    - Loop over sources array
    - For each source, make new file tree
    - Make "old" file tree based on source.tracks
    - Compare old and new trees
    - Remove missing tracks
    - Add new tracks

  */

  return new Promise((resolve) => {
    setTimeout(resolve, 10000);
  });
}
