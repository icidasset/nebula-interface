import React from 'react';
import { Route } from 'react-router';

import App from './containers/App.js';
import IndexPage from './containers/IndexPage.js';
import SignInPage from './containers/SignInPage.js';


export default (
  <Route path="" component={App}>
    <Route path="/" component={IndexPage} />
    <Route path="/sign-in" component={SignInPage} />
  </Route>
);
