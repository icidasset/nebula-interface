/**
 * Generate a unique identifier for a single track.
 */
export function generateTrackId(track) {
  return `${track.sourceId}/${track.path}`;
}


export function generateTrackIdWithAttributes(sourceId, path) {
  return `${sourceId}/${path}`;
}
