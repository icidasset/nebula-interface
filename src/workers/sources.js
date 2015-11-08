import difference from 'lodash/array/difference';
import groupBy from 'lodash/collection/groupBy';
import pairs from 'lodash/object/pairs';

import { ID3 as meta } from 'imports?this=>{},window=>self!exports?this!../../vendor/id3-minimized.js';

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
      const diff = compareTrees({
        external: externalTrees,
        internal: internalTrees,
      });

      return diff;
    }
  ).then(
    (diff) => {
      return getAttributesForNewTracks(
        Object.assign({}, args, { diff })
      );
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


function getAttributesForNewTracks(args) {
  const diffPaired = pairs(args.diff);
  const sourcesGroupedById = groupBy(args.sources, 'uid');
  const results = {};

  return getAttributesForNewTrackLoop(
    diffPaired,
    sourcesGroupedById,
    0,
    0,
    results

  ).then((newAttributes) => {
    return Object.assign({}, args.diff, newAttributes);

  });
}


function getAttributesForNewTrackLoop(diffs, sources, sourceIdx, itemIdx, results) {
  const diff = diffs[sourceIdx];
  const newItems = diff ? diff[1].new : [];
  const newItem = newItems[itemIdx];
  const source = diff ? sources[diff[0]][0] : null;

  if (!newItem || !source) {
    return Promise.resolve(results);
  }

  return getAttributesForNewTrack(source, newItem).then((tags) => {
    results[source.uid] = results[source.uid] || {};
    results[source.uid].new = results[source.uid].new || [];

    if (tags) {
      results[source.uid].new.push(tags);
    }

    let nextItemIdx = itemIdx + 1;
    let nextSourceIdx = sourceIdx;

    if (!newItems[nextItemIdx]) {
      nextItemIdx = 0;
      nextSourceIdx = sourceIdx + 1;
    }

    if (!diffs[nextSourceIdx]) {
      // = done
      return results;
    }

    return getAttributesForNewTrackLoop(
      diffs,
      sources,
      nextSourceIdx,
      nextItemIdx,
      results
    );
  });
}


function getAttributesForNewTrack(source, newItem) {
  return new Promise((resolve) => {

    const urlHead = awsUtils.getSignedUrl(source, encodeURIComponent(newItem), 'HEAD', 1);
    const urlGet = awsUtils.getSignedUrl(source, encodeURIComponent(newItem), 'GET', 1);

    meta.loadTags(urlGet, urlHead, () => {
      const {
        album,
        artist,
        genre,
        title,
        track,
        year,
      } = meta.getAllTags(urlGet);

      resolve({
        path: newItem,

        album: album ? album.toString() : undefined,
        artist: artist ? artist.toString() : undefined,
        genre: genre ? genre.toString() : undefined,
        title: title ? title.toString() : undefined,
        year: year ? year.toString() : undefined,

        track: track,
      });
    }, {
      onError: () => {
        resolve(null);
      },
    });

  });
}
