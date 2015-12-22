import * as types from '../constants/action_types/connection';


export function goOffline() {
  console.log('go offline');
  return { type: types.GO_OFFLINE };
}


export function goOnline() {
  console.log('go online');
  return { type: types.GO_ONLINE };
}
