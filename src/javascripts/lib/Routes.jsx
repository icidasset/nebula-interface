import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './App.jsx';

import AboutPage from '../pages/AboutPage.jsx';
import IndexPage from '../pages/IndexPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';


const Routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={IndexPage} />
    <Route handler={AboutPage} path="/about" />

    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

export default Routes;
