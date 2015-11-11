import difference from 'lodash/array/difference';
import groupBy from 'lodash/collection/groupBy';
import mapValues from 'lodash/object/mapValues';
import pairs from 'lodash/object/pairs';

import { ID3 as meta } from 'imports?this=>{},window=>self!exports?this!../../vendor/id3-minimized.js';

import * as sourceUtils from '../utils/sources';
import { makeTrackObject } from '../reducers/tracks';


self.addEventListener('message', (event) => {
  process(event.data).then((diff) => {
    self.postMessage({ isDone: true, diff });
    self.close();
  });
});


/// Utils
///
function process(args) {
  const externalTreesPromise = getExternalTrees(args.sources);
  const internalTrees = getInternalTrees(args.tracks);

  return externalTreesPromise.then(
    (externalTrees) => {
      return compareTrees({
        external: externalTrees,
        internal: internalTrees,
      });
    }
  ).then(
    (diff) => {
      return getAttributesForNewTracks(
        Object.assign({}, args, { diff })
      );
    }
  );
}


/**
 * Get trees from external sources.
 *
 * @struct tree
 * [ path, path, ... ]
 *
 * @return {Promise}
 * { `${source-id}` : tree }
 */
function getExternalTrees(sources) {
  const promises = sources.map((source) => {
    return sourceUtils.getTree(source).then(
      (tree) => {
        return { sourceId: source.uid, tree };
      }
    );
  });

  return Promise.all(promises).then(
    (treesWithSource) => {
      const treesGroupedBySourceId = {};

      treesWithSource.forEach((t) => {
        treesGroupedBySourceId[t.sourceId] = t.tree;
      });

      return treesGroupedBySourceId;
    }
  );
}


/**
 * Get paths from stored tracks to make internal trees.
 *
  * @struct tree
  * [ path, path, ... ]
  *
  * @return {Promise}
  * { `${source-id}` : tree }
 */
function getInternalTrees(tracks) {
  const tracksGroupedBySourceId = groupBy(tracks, 'sourceId');
  const trees = {};

  Object.keys(tracksGroupedBySourceId).forEach((sourceId) => {
    trees[sourceId] = tracksGroupedBySourceId[sourceId].map((track) => track.path);
  });

  return trees;
}


/**
 * Compare external and internal trees.
 * Returns a diff.
 *
 * @return
 * { `${source-id}` : { missing: [path], new: [path] }}
 */
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

  console.log(JSON.stringify(diff));

  return diff;
}


/**
 * Get the metadata from the (new) remote audio files.
 */
function getAttributesForNewTracks(args) {
  const diffPaired = pairs(args.diff);
  const sourcesGroupedById = groupBy(args.sources, 'uid');
  const results = mapValues(args.diff, (d) => {
    return { new: [], missing: d.missing };
  });

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

    const urlHead = sourceUtils.getSignedUrl(source, newItem, 'HEAD', 1);
    const urlGet = sourceUtils.getSignedUrl(source, newItem, 'GET', 1);

    meta.loadTags(urlGet, urlHead, () => {
      const {
        album,
        artist,
        genre,
        title,
        track,
        year,
      } = meta.getAllTags(urlGet);

      resolve(makeTrackObject({
        path: newItem,
        sourceId: source.uid,

        properties: {
          album: album ? album.toString() : undefined,
          artist: artist ? artist.toString() : undefined,
          genre: genre ? genre.toString() : undefined,
          title: title ? title.toString() : undefined,
          year: year ? year.toString() : undefined,

          track: track,
        },
      }));
    }, {
      onError: () => {
        resolve(null);
      },
    });

  });
}
