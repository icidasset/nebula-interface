import * as types from '../constants/action_types/connection';


export function goOffline() {
  return { type: types.GO_OFFLINE };
}


export function goOnline() {
  return { type: types.GO_ONLINE };
}
