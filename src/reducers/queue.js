import findLastIndex from 'lodash/array/findLastIndex';

import * as types from '../constants/action_types/queue';
import * as trackUtils from '../utils/tracks';


const initialState = {
  history: [],
  items: [],

  activeItem: null,
  repeat: false,
  shuffle: false,

  ...retrieveSettings(),
};


export default function queue(state = initialState, action) {
  let newActiveItem;
  let newHistory;
  let newItems;
  let newState;

  switch (action.type) {
  case types.INJECT_INTO_QUEUE:
    const trackId = trackUtils.generateTrackId(action.track);
    const track = { ...action.track, injected: true };

    if (action.replace && state.activeItem) {
      newHistory = [ ...state.history, state.activeItem ];
    } else {
      newHistory = [ ...state.history ];
    }

    if (action.replace) {
      newItems = state.items.filter(
        (i) => trackUtils.generateTrackId(i) !== trackId
      );
    } else {
      const lastIndex = findLastIndex(state.items, { injected: true }) + 1;

      newItems = [ ...state.items ];
      newItems.splice(lastIndex, 0, track);
    }

    return {
      ...state,

      activeItem: action.replace ? track : state.activeItem,
      history: newHistory,
      items: newItems,
    };


  case types.REFILL_QUEUE:
    return {
      ...state,
      items: state.items.concat(action.newItems),
    };


  case types.REFRESH_QUEUE:
    // TODO:
    // - remove non-existing (old) items from
    //   `state.queue.items`,
    //   `state.queue.history`,
    //   `state.queue.activeItem`

    return state;


  case types.RESET_QUEUE:
    return {
      ...state,
      items: state.items.filter((i) => i.injected),
    };


  case types.SHIFT_QUEUE:
    if (state.activeItem) {
      newHistory = [ ...state.history, state.activeItem ];
    } else {
      newHistory = [ ...state.history ];
    }

    newActiveItem = state.items.shift();

    return {
      ...state,

      activeItem: newActiveItem,
      history: newHistory,
    };


  case types.TOGGLE_REPEAT:
    newState = {
      ...state,
      repeat: !state.repeat,
    };

    storeSettings(newState);
    return newState;


  case types.TOGGLE_SHUFFLE:
    newState = {
      ...state,
      shuffle: !state.shuffle,
    };

    storeSettings(newState);
    return newState;


  case types.UNSHIFT_QUEUE:
    if (state.activeItem) {
      newItems = state.items.slice(0, state.items.length - 1);
      newItems.unshift(state.activeItem);
    }

    newActiveItem = state.history.pop();

    if (newActiveItem) {
      return {
        ...state,

        activeItem: newActiveItem,
        items: newItems || [],
      };
    }

    return state;


  default:
    return state;
  }
}


/// Private
///
function storeSettings(state) {
  const settings = { shuffle: state.shuffle, repeat: state.repeat };
  window.localStorage.setItem('queueSettings', JSON.stringify(settings));
}


function retrieveSettings() {
  return JSON.parse(window.localStorage.getItem('queueSettings') || '{}');
}
