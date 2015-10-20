import { combineReducers } from 'redux';

import auth from './auth';
import collections from './collections';
import routing from './routing';
import sources from './sources';
import tracks from './tracks';


const rootReducer = combineReducers({
  auth,
  collections,
  routing,
  sources,
  tracks,
});


export default rootReducer;
