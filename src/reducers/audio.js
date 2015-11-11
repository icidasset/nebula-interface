import * as types from '../constants/action_types/audio';


const initialState = {
  isMuted: false,
  volume: 0.5,

  // feedback
  duration: 0,

  // feedback, special
  currentTime: 0,
  progress: 0,
};


export default function audio(state = initialState, action) {
  switch (action.type) {

  case types.SET_AUDIO_DURATION:
    return Object.assign({}, state, {
      duration: action.value,
    });

  case types.SET_AUDIO_VOLUME:
    return Object.assign({}, state, {
      volume: action.value,
    });

  case types.TOGGLE_MUTE:
    return Object.assign({}, state, {
      isMuted: !state.isMuted,
    });

  // NOTE:
  // THESE ACTIONS DO NOT TRIGGER STATE CHANGES,
  // I.E. THEY DO NOT RETURN A NEW STATE OBJECT.
  //
  // This was done for performance reasons.
  // These values change every 250ms, more or less.
  // Instead use requestAnimationFrame, setInterval
  // or something else to render these values.
  //
  case types.SET_AUDIO_CURRENT_TIME:
    state.currentTime = action.value;
    return state;

  case types.SET_AUDIO_PROGRESS:
    state.progress = action.value;
    return state;

  default:
    return state;
  }
}
