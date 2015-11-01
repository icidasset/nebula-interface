import * as types from '../constants/action_types/sources';


const initialSource = {
  type: types.SOURCE_TYPE_DEFAULT,
  name: 'Untitled Music Collection',

  properties: {
    // properties specific to this source_type
  },

  settings: {
    directory_collections: false,
  },
};


const initialState = {
  isProcessing: false,
  isFetching: true,

  items: [],
};


export default function sources(state = initialState, action) {
  switch (action.type) {
  case types.START_PROCESS_SOURCES:
    return Object.assign({}, state, {
      isProcessing: true,
    });

  case types.END_PROCESS_SOURCES:
    return Object.assign({}, state, {
      isProcessing: false,
    });

  case types.FETCH_SOURCES:
    return Object.assign({}, state, {
      isFetching: true,
    });

  case types.FETCH_SOURCES_DONE:
    // resets the local-items collection
    return Object.assign({}, state, {
      isFetching: false,
      items: action.items || [],
    });

  case types.ADD_SOURCE:
    return Object.assign({}, state, {
      items: [
        ...state.items,
        Object.assign({}, initialSource, action.source),
      ],
    });

  case types.DELETE_SOURCE:
    return Object.assign({}, state, {
      items: state.items.filter((item) => item.uid !== action.uid),
    });

  default:
    return state;
  }
}
