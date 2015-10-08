import * as types from '../action_types/tracks';


export function addTrack(attributes) {
  return { type: types.ADD_TRACK, attributes };
}
