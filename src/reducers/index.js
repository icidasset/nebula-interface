import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import collections from './collections';
import sources from './sources';
import tracks from './tracks';


const rootReducer = combineReducers({
  router,

  collections,
  sources,
  tracks,
});


export default rootReducer;
