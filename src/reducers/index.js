import { combineReducers } from 'redux';

import audio from './audio';
import auth from './auth';
import collections from './collections';
import queue from './queue';
import routing from './routing';
import sources from './sources';
import tracks from './tracks';


const rootReducer = combineReducers({
  audio,
  auth,
  collections,
  queue,
  routing,
  sources,
  tracks,
});


export default rootReducer;
