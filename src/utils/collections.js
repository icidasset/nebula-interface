import filter from 'lodash/collection/filter';
import isObject from 'lodash/lang/isObject';

import * as trackUtils from './tracks';


export function generateSpecialCollectionId(type, value) {
  return `special:${type}:${value}`;
}


export function generateSpecialPairs(special) {
  return Object.keys(special).map((k) => {
    return special[k].map((s) => {
      return [
        [ k, s ],
        generateSpecialCollectionId(k, s),
      ];
    });
  });
}


/**
 * Types
 */
const typeHandlers = {

  directory(tracks, value) {
    const n = tracks.filter((t) => {
      return t.path.split('/')[0] === value;
    });

    return n;
  },

};


export function matchTracksWithSpecial(tracks, specialCollectionId) {
  const split = specialCollectionId.split(':');
  const type = split[1];
  const value = split.slice(2).join(':');

  // check if correct id
  if (split[0] !== 'special' || !type || !typeHandlers[type]) {
    return [ ...tracks ];
  }

  // run type handler
  return typeHandlers[type](tracks, value);
}


export function matchTracksWithNormal(tracks, collection) {
  const collectionIds = (collection.trackIds || []).slice(0);

  return filter(tracks, (track) => {
    const id = trackUtils.generateTrackId(track);
    const cidx = collectionIds.indexOf(id);

    if (cidx !== -1) {
      collectionIds.splice(cidx, 1);
      return true;
    }
  });
}


export function matchTracksWithCollection(tracks, collection) {
  if (isObject(collection)) {
    return matchTracksWithNormal(tracks, collection);
  }

  return matchTracksWithSpecial(tracks, collection);
}
