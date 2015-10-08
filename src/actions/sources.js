import * as types from '../action_types/sources';


export function processSources() {
  return (dispatch, getState) => {
    if (!getState().sources.isProcessing) {
      return dispatch(execProcess());
    }
  };
}

export function addSource(attributes) {
  return { type: types.ADD_SOURCE, attributes };
}


/// Private
///
function execProcess() {
  return (dispatch, getState) => {
    const state = getState();

    const sources = state.sources.items;

    // TODO:
    // const tracks = state.tracks.items;
    // groupTracksBySource()

    // notify 'start'
    dispatch({ type: types.START_PROCESS_SOURCES });

    // process & notify 'end'
    return process(sources).then(() => {
      dispatch({ type: types.END_PROCESS_SOURCES });
    });
  };
}


function process(sources) {
  /*

    TODO:
    - Loop over sources array
    - For each source, make new file tree
    - Make "old" file tree based on source.tracks
    - Compare old and new trees
    - Remove missing tracks
    - Add new tracks

  */

  return new Promise(function(resolve) {
    setTimeout(resolve, 10000);
  });
}
