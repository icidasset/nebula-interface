import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import sources from './sources';
import tracks from './tracks';


const rootReducer = combineReducers({
  router,

  sources,
  tracks,
});


export default rootReducer;
