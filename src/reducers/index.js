import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import sources from './sources';


const rootReducer = combineReducers({
  router,

  sources,
});


export default rootReducer;
