import * as awsUtils from './aws';
import * as sourceActionTypes from '../constants/action_types/sources';

import FILE_FORMATS from '../constants/supported_file_formats';


const pathRegex = new RegExp(
  `\.(${FILE_FORMATS.join('|')})$`
);


const utils = {};

utils[sourceActionTypes.SOURCE_TYPE_AWS_BUCKET] = awsUtils;


/// Public
///

/**
 * Get tree
 *
 * @return {array}
 * ['path/to/file.mp3', 'another_path.mp4']
 */
export function getTree(source) {
  const sourceTypeUtils = utils[source.type];

  if (sourceTypeUtils && sourceTypeUtils.getTree) {
    return sourceTypeUtils.getTree(source, pathRegex);
  }

  console.error(`The source type '${source.type}' was not implemented correctly.`);
  return [];
}


/**
 * Get signed url
 *
 * @return {string}
 * "http://example.com/path/to/file.mp3"
 */
export function getSignedUrl(source, path, method = 'GET', expiresInMinutes = 1440) {
  const sourceTypeUtils = utils[source.type];

  if (sourceTypeUtils && sourceTypeUtils.getSignedUrl) {
    return sourceTypeUtils.getSignedUrl(
      source,
      encodeURIComponent(path),
      method,
      expiresInMinutes
    );
  }

  console.error(`The source type '${source.type}' was not implemented correctly.`);
  return path;
}
