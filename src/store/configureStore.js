import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import routes from '../routes';


const finalCreateStore = compose(
  applyMiddleware(thunk),
  reduxReactRouter({ routes, createHistory })
)(createStore);


export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
