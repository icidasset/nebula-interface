/**
 * Generate a unique identifier for a single track.
 */
export function generateTrackId(track) {
  return `${track.sourceUid}/${track.path}`;
}


export function generateTrackIdWithAttributes(sourceUid, path) {
  return `${sourceUid}/${path}`;
}
