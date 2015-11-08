import groupBy from 'lodash/collection/groupBy';

import * as firebase from '../utils/firebase';
import * as types from '../constants/action_types/sources';

import SourcesWorker from 'worker!../workers/sources.js';


/// Actions
///
export function addSource(attributes) {
  return (dispatch, getState) => {
    const state = getState();

    return firebase.add('sources', attributes, state.auth.user.uid).then(
      (source) => dispatch({ type: types.ADD_SOURCE, source })
    );
  };
}


export function deleteSource(uid) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.DELETE_SOURCE, uid });

    return firebase.remove('sources', uid, state.auth.user.uid);
  };
}


export function fetchSources() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: types.FETCH_SOURCES });

    return firebase.fetch('sources', state.auth.user.uid).then(
      (result) => {
        const items = firebase.convertPushedToArray(result || {});
        dispatch({ type: types.FETCH_SOURCES_DONE, items });
      }
    );
  };
}


export function processSources() {
  return (dispatch, getState) => {
    if (!getState().sources.isProcessing) {
      return dispatch(execProcess());
    }
  };
}


/// Private
///
function execProcess() {
  return (dispatch, getState) => {
    const state = getState();
    const sources = state.sources.items;
    const tracksGroupedBySourceId = groupBy(state.tracks.items, 'source_uid');

    // notify 'start'
    dispatch({ type: types.START_PROCESS_SOURCES });

    // process & notify 'end'
    const worker = new SourcesWorker();

    worker.onmessage = (event) => {
      const data = event.data || {};

      if (data.isDone) {
        const newTracksCollection = handleTracksDiff(
          state.tracks.items,
          data.results,
        );

        if (newTracksCollection) {
          // TODO: dispatch replace_tracks action
        }

        dispatch({ type: types.END_PROCESS_SOURCES });
      }
    };

    worker.postMessage({
      sources,
      tracksGroupedBySourceId,
    });
  };
}


function handleTracksDiff(tracks, diff) {
  const missingTracks = [];
  const newTracks = [];

  let collection;

  Object.keys(diff).forEach((sourceId) => {
    const d = diff[sourceId];

    d.missing.forEach((missingItem) => {
      missingTracks.push(`${sourceId}/${missingItem}`);
    });

    if (d.new.length) {
      newTracks = newTracks.concat(d.new);
    }
  });

  // remove missing tracks
  if (missingTracks.length) {
    collection = tracks.filter((track) => {
      return missingTracks.indexOf(`${track.sourceId}/${track.path}`) === -1;
    });
  }

  // add new tracks
  if (newTracks.length) {
    collection = (collection || tracks).concat(newTracks);
  }

  // return
  return collection;
}
