import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import * as audioEngine from './utils/engines/audio';
import * as historyEngine from './utils/engines/history';
import * as queueEngine from './utils/engines/queue';
import store from './main-store';
import App from './containers/App';


// const debugPanel = (
//   <DebugPanel top right bottom>
//     <DevTools store={store} monitor={LogMonitor} />
//   </DebugPanel>
// );


const history = historyEngine.initialize(store);

audioEngine.initialize(store);
queueEngine.initialize(store);


render(
  <Provider store={store}><App history={history} /></Provider>,
  document.getElementById('root')
);
