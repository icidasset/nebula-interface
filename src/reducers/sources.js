import * as types from '../constants/action_types/sources';


const initialSource = {
  type: types.SOURCE_TYPE_DEFAULT,
  name: 'Untitled Music Collection',

  properties: {},

  settings: {
    directoryCollections: false,
  },
};


const initialState = {
  isProcessing: false,
  isFetching: true,
  processingProgress: 0.0,

  items: [],
};


export default function sources(state = initialState, action) {
  switch (action.type) {
  case types.ADD_SOURCE:
    return {
      ...state,
      items: [
        ...state.items,
        { ...initialSource, ...action.source },
      ],
    };


  case types.DELETE_SOURCE:
    return {
      ...state,
      items: state.items.filter((item) => item.uid !== action.uid),
    };


  case types.END_PROCESS_SOURCES:
    return {
      ...state,
      isProcessing: false,
    };


  case types.FETCH_SOURCES:
    return {
      ...state,
      isFetching: true,
    };


  case types.FETCH_SOURCES_DONE:
    return {
      ...state,
      isFetching: false,
      items: action.items || [],
    };


  case types.SET_PROCESS_SOURCES_PROGRESS:
    return {
      ...state,
      processingProgress: action.value || 0.0,
    };


  case types.START_PROCESS_SOURCES:
    return {
      ...state,
      isProcessing: true,
    };


  default:
    return state;
  }
}
