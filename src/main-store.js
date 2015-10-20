import { createStore, applyMiddleware, compose } from 'redux';
import { devTools } from 'redux-devtools';
import thunk from 'redux-thunk';

import rootReducer from './reducers';


const finalCreateStore = compose(
  applyMiddleware(thunk),
  devTools()
)(createStore);


export default finalCreateStore(rootReducer, {});
