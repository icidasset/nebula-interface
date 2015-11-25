import * as types from '../constants/action_types/audio';
import * as queueActions from './queue';


/// Actions
///
export function setAudioDuration(value) {
  return { type: types.SET_AUDIO_DURATION, value };
}


export function setAudioIsPlaying(value) {
  return { type: types.SET_AUDIO_IS_PLAYING, value };
}


export function setAudioVolume(value) {
  return { type: types.SET_AUDIO_VOLUME, value };
}


export function toggleMute() {
  return { type: types.TOGGLE_MUTE };
}


export function togglePlay() {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.queue.activeItem) {
      dispatch(queueActions.shiftQueue());
    }

    return dispatch({ type: types.TOGGLE_PLAY });
  };
}
