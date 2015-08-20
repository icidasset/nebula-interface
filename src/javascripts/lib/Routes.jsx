import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import App from './App.jsx';

import AboutPage from '../pages/AboutPage.jsx';
import IndexPage from '../pages/IndexPage.jsx';


const Routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={IndexPage} />
    <Route handler={AboutPage} path="/about" />
  </Route>
);

export default Routes;
