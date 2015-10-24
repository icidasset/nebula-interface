import 'babel/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import * as history from './utils/history';
import store from './main-store';
import App from './containers/App';


// const debugPanel = (
//   <DebugPanel top right bottom>
//     <DevTools store={store} monitor={LogMonitor} />
//   </DebugPanel>
// );


history.initialize(store);


render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
