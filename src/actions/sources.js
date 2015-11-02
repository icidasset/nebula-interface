import difference from 'lodash/array/difference';
import groupBy from 'lodash/collection/groupBy';

import * as awsUtils from '../utils/sources/aws';
import * as firebase from '../utils/firebase';
import * as types from '../constants/action_types/sources';


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
    return process(sources, tracksGroupedBySourceId).then(() => {
      dispatch({ type: types.END_PROCESS_SOURCES });
    });
  };
}


function process(sources, tracksGroupedBySourceId) {
  const externalTreesPromise = getExternalTrees(sources);
  const internalTrees = getInternalTrees(tracksGroupedBySourceId);

  return externalTreesPromise.then(
    (externalTrees) => {
      const diff = compareTrees({
        external: externalTrees,
        internal: internalTrees,
      });

      return diff;
    }
  ).then(
    (diff) => {
      let missing = [];

      Object.keys(diff).map((sourceId) => {
        missing = missing.concat(diff[sourceId].missing);
      });

      // TODO:
      // - Get metadata from new paths
      // - Send array of { attributes: metadata } to 'ADD_TRACKS'

      return missing;
    }
  );
}


function getExternalTrees(sources) {
  const promises = sources.map((source) => {
    let promise;

    if (source.type === types.SOURCE_TYPE_AWS_BUCKET) {
      promise = awsUtils.getTree(source);
    }

    return promise.then(
      (tree) => {
        return { source_uid: source.uid, source, tree };
      }
    );
  });

  return Promise.all(promises).then(
    (treesWithSource) => groupBy(treesWithSource, 'source_uid')
  );
}


function getInternalTrees(tracksGroupedBySourceId) {
  const trees = {};

  Object.keys(tracksGroupedBySourceId).forEach((sourceId) => {
    trees[sourceId] = tracksGroupedBySourceId[sourceId].map((track) => track.path);
  });

  return trees;
}


function compareTrees(args) {
  const { external, internal } = args;
  const diff = {};

  Object.keys(external).forEach((sourceId) => {
    const sourceOfTruth = external[sourceId];
    const internalItems = internal[sourceId] || [];

    const newItems = difference(sourceOfTruth, internalItems);
    const missingItems = difference(internalItems, sourceOfTruth);

    if (newItems.length || missingItems.length) {
      diff[sourceId] = { 'new': newItems, 'missing': missingItems };
    }
  });

  return diff;
}
