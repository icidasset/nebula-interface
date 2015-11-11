import * as types from '../constants/action_types/audio';


/// Actions
///
export function setAudioDuration(value) {
  return { type: types.SET_AUDIO_DURATION, value };
}


export function setAudioCurrentTime(value) {
  return { type: types.SET_AUDIO_CURRENT_TIME, value };
}


export function setAudioProgress(value) {
  return { type: types.SET_AUDIO_PROGRESS, value };
}


export function setAudioVolume(value) {
  return { type: types.SET_AUDIO_VOLUME, value };
}


export function toggleMute() {
  return { type: types.TOGGLE_MUTE };
}
