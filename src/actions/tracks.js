import * as types from '../constants/action_types/tracks';


export function addTrack(attributes) {
  return { type: types.ADD_TRACK, attributes };
}
