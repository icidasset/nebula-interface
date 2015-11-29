import findIndex from 'lodash/array/findIndex';
import last from 'lodash/array/last';
import range from 'lodash/utility/range';
import shuffle from 'lodash/collection/shuffle';

import * as trackUtils from '../utils/tracks';
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
 * Reset.
 * Clear queue and refill.
 */
export function resetQueue() {
  return (dispatch) => {
    dispatch({ type: types.RESET_QUEUE });
    dispatch(refill());
  };
}


/**
 * Inject track into queue.
 */
export function injectIntoQueue(track) {
  return (dispatch) => {
    dispatch({ type: types.INJECT_INTO_QUEUE, track });
    dispatch(refill());
  };
}


/**
 * Toggle shuffle
 */
export function toggleShuffle() {
  return (dispatch) => {
    dispatch({ type: types.TOGGLE_SHUFFLE });
    dispatch(resetQueue());
  };
}


/**
 * Toggle repeat
 */
export function toggleRepeat() {
  return { type: types.TOGGLE_REPEAT };
}


/// Private
///

/**
 * Refill queue.
 * Only add tracks to the queue which have not been played before,
 * are currently playing or that are already in the queue.
 */
function refill() {
  return (dispatch, getState) => {
    const state = getState();
    const doShuffle = state.queue.shuffle;
    const trackIds = state.tracks.filteredItemIds;

    if (state.queue.items.length >= types.QUEUE_LENGTH) {
      return 'EXIT - ALREADY FULL';
    } else if (!trackIds.length) {
      return 'EXIT - NO TRACKS';
    }

    const newItems = [];
    const currentItems = []
      .concat(state.queue.history)
      .concat(state.queue.activeItem ? [state.queue.activeItem] : [])
      .concat(state.queue.items)
      .map(trackUtils.generateTrackId);

    let i = 0;
    let indexes = range(0, trackIds.length).filter((n) => {
      return currentItems.indexOf(trackIds[n]) === -1;
    });

    if (!indexes.length) {
      indexes = range(0, trackIds.length);
    }

    if (doShuffle) {
      // randomize
      indexes = shuffle(indexes);

    } else if (currentItems.length) {
      // continue
      i = trackIds.indexOf(last(currentItems));
      i = findIndex(indexes, (n) => (n > i));
      i = i < 0 ? 0 : i;

    }

    while (newItems.length < indexes.length && newItems.length < types.QUEUE_LENGTH) {
      const newItem = Object.assign({}, state.tracks.filteredItems[indexes[i]]);
      newItems.push(newItem);

      if (i + 1 >= indexes.length) i = 0;
      else i = i + 1;
    }

    dispatch({ type: types.REFILL_QUEUE, newItems });
  };
}
