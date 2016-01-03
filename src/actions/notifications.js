import * as types from '../constants/action_types/notifications';


export function addNotification(n) {
  const uid = ((new Date()).getTime() + Math.round(Math.random() * 1000)).toString();
  const notification = { ...n, uid, autoDismiss: 5 };
  return { type: types.ADD_NOTIFICATION, notification };
}


export function clearNotifications() {
  return { type: types.CLEAR_NOTIFICATIONS };
}


export function removeNotification(uid) {
  return { type: types.REMOVE_NOTIFICATION, uid };
}
