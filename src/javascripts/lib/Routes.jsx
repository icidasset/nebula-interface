import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import App from './App.jsx';

import IndexPage from '../pages/IndexPage.jsx';


const Routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={IndexPage} />
  </Route>
);

export default Routes;
