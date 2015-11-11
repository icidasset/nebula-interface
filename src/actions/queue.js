import shuffle from 'lodash/collection/shuffle';

import * as types from '../constants/action_types/queue';


/// Actions
///

/**
 * Move to the next item.
 * Set the first item in the queue as the active item.
 */
export function shiftQueue() {
  return (dispatch) => {
    dispatch({ type: types.SHIFT_QUEUE });
    dispatch(refill());
  };
}


/**
 * Go back.
 * Add the active item back in front.
 */
export function unshiftQueue() {
  return { type: types.UNSHIFT_QUEUE };
}


/**
 * Refresh.
 * Check if there are old (now non-existing) tracks in the queue.
 */
export function refreshQueue() {
  return (dispatch) => {
    dispatch({ type: types.REFRESH_QUEUE });
    dispatch(refill());
  };
}


/**
 * Toggle shuffle
 */
export function toggleShuffle() {
  return { type: types.TOGGLE_SHUFFLE };
}


/**
 * Toggle repeat
 */
export function toggleRepeat() {
  return { type: types.TOGGLE_REPEAT };
}


/// Private
///
function refill() {
  return (dispatch, getState) => {
    const state = getState();
    const tracks = state.queue.shuffle ?
      shuffle(state.tracks.items) :
      state.tracks.items;

    const newItems = [];
    const currentItems = getState().queue.items.map((item) => {
      return `${item.sourceId}/${item.path}`;
    });

    for (let i = 0, j = tracks.length; i < j; i++) {
      const track = tracks[i];

      if (newItems.length >= types.QUEUE_LENGTH) {
        break;
      } else if (currentItems.indexOf(`${track.sourceId}/${track.path}`) === -1) {
        newItems.push(Object.assign({}, track));
      }
    }

    return dispatch({ type: types.REFILL_QUEUE, newItems });
  };
}
