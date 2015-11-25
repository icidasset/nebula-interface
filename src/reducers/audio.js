import * as types from '../constants/action_types/audio';


const initialState = {
  isMuted: false,
  volume: 0.5,

  // feedback
  duration: 0,
  isPlaying: false,

  // feedback, do not trigger change handlers
  currentTime: 0,
  progress: 0,
};


export default function audio(state = initialState, action) {
  switch (action.type) {

  case types.SET_AUDIO_DURATION:
    return {
      ...state,
      duration: action.value,
    };

  case types.SET_AUDIO_IS_PLAYING:
    return {
      ...state,
      isPlaying: !!action.value,
    };

  case types.SET_AUDIO_VOLUME:
    return {
      ...state,
      volume: action.value,
    };

  case types.TOGGLE_MUTE:
    return {
      ...state,
      isMuted: !state.isMuted,
    };

  case types.TOGGLE_PLAY:
    return {
      ...state,
      isPlaying: !state.isPlaying,
    };

  default:
    return state;
  }
}
