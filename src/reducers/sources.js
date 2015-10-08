import * as types from '../action_types/sources';


const initialSource = {
  type: types.SOURCE_TYPE_DEFAULT,
  name: 'Untitled Music Collection',

  properties: {
    // access_key: '...',
    // secret_key: '...'
  },

  settings: {
    // directory_collections: true
  }
};


const initialState = {
  isProcessing: false,
  isFetching: false,

  items: []
};


export default function sources(state = initialState, action) {
  switch (action.type) {
  case types.START_PROCESS_SOURCES:
    return Object.assign({}, state, {
      isProcessing: true
    });

  case types.END_PROCESS_SOURCES:
    return Object.assign({}, state, {
      isProcessing: false
    });

  case types.ADD_SOURCE:
    return Object.assign({}, state, {
      items: [
        ...state.items,
        Object.assign({}, initialSource, action.attributes)
      ]
    });

  default:
    return state;
  }
}
