import * as types from '../constants/action_types/collections';


/// Actions
///
export function addCollection(attributes) {
  return { type: types.ADD_COLLECTION, attributes };
}
