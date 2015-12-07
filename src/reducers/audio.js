import * as types from '../constants/action_types/audio';


const initialState = {
  isMuted: false,
  volume: 0.5,

  // feedback
  duration: 0,
  durationStamp: '0:00',
  isLoading: false,
  isPlaying: false,
  seek: 0,

  // fast feedback
  currentTime: 0,
};


export default function audio(state = initialState, action) {
  switch (action.type) {

  case types.SEEK_AUDIO:
    return {
      ...state,
      seek: action.percentageDecimal,
    };


  case types.SET_AUDIO_CURRENT_TIME:
    return {
      ...state,
      currentTime: action.value,
    };


  case types.SET_AUDIO_DURATION:
    let minutes = Math.floor(action.value / 60);
    let seconds = Math.floor(action.value - (minutes * 60));

    if (minutes.toString().length === 1) minutes = `0${minutes}`;
    if (seconds.toString().length === 1) seconds = `0${seconds}`;

    return {
      ...state,
      duration: action.value,
      durationStamp: `${minutes}:${seconds}`,
    };


  case types.SET_AUDIO_IS_LOADING:
    return {
      ...state,
      isLoading: !!action.value,
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
