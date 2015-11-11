import * as types from '../constants/action_types/audio';


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
