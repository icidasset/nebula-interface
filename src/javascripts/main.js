import React from 'react';
import Router from 'react-router';

import Routes from './lib/Routes.jsx';


export function render(locals, callback) {
  Router.run(Routes, locals.path, function renderRoute(Handler) {
    callback(
      null,
      '<!DOCTYPE html>' + React.renderToStaticMarkup(
        React.createElement(Handler, locals)
      )
    );
  });
}
