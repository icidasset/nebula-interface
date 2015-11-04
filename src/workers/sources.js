import difference from 'lodash/array/difference';

import * as awsUtils from '../utils/sources/aws';
import * as types from '../constants/action_types/sources';

import FILE_FORMATS from '../constants/supported_file_formats';


self.addEventListener('message', (event) => {
  process(event.data).then((results) => {
    self.postMessage({ isDone: true, results: results });
    self.close();
  });
});


/// Utils
///
function process(args) {
  const externalTreesPromise = getExternalTrees(args.sources);
  const internalTrees = getInternalTrees(args.tracksGroupedBySourceId);

  return externalTreesPromise.then(
    (externalTrees) => {
      console.log(JSON.stringify(externalTrees));

      const diff = compareTrees({
        external: externalTrees,
        internal: internalTrees,
      });

      return diff;
    }
  ).then(
    (diff) => {

      // TODO:
      // - Get metadata from new paths
      // - Send array of { attributes: metadata } to 'ADD_TRACKS'

      return diff;
    }
  );
}


function getExternalTrees(sources) {
  const pathRegex = new RegExp(
    `\.(${FILE_FORMATS.join('|')})$`
  );

  const promises = sources.map((source) => {
    let promise;

    if (source.type === types.SOURCE_TYPE_AWS_BUCKET) {
      promise = awsUtils.getTree(source, pathRegex);
    }

    return promise.then(
      (tree) => {
        return { source_uid: source.uid, tree };
      }
    );
  });

  return Promise.all(promises).then(
    (treesWithSource) => {
      const treesGroupedBySourceId = {};

      treesWithSource.forEach((t) => {
        treesGroupedBySourceId[t.source_uid] = t.tree;
      });

      return treesGroupedBySourceId;
    }
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
