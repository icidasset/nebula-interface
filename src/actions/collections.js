import * as types from '../action_types/collections';


export function addCollection(attributes) {
  return { type: types.ADD_COLLECTION, attributes };
}
