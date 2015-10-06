import React from 'react';
import { Route } from 'react-router';

import App from './containers/App.js';
import AppPage from './containers/AppPage.js';
import SignInPage from './containers/SignInPage.js';


export default (
  <Route path="" component={App}>
    <Route path="/app" component={AppPage} />
    <Route path="/sign-in" component={SignInPage} />
  </Route>
);
