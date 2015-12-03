import * as types from '../constants/action_types/audio';
import * as queueActions from './queue';


/// Actions
///
export const setAudioCurrentTime = (value) => ({ type: types.SET_AUDIO_CURRENT_TIME, value });
export const setAudioDuration = (value) => ({ type: types.SET_AUDIO_DURATION, value });
export const setAudioIsPlaying = (value) => ({ type: types.SET_AUDIO_IS_PLAYING, value });
export const setAudioVolume = (value) => ({ type: types.SET_AUDIO_VOLUME, value });


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


export function seekAudio(percentageDecimal) {
  return { type: types.SEEK_AUDIO, percentageDecimal };
}
