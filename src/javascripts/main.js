import React from 'react';
import Router from 'react-router';

import Routes from './lib/Routes.jsx';


export default function(locals, callback) {
  Router.run(Routes, locals.path, function renderRoute(Handler) {
    const html = React.renderToStaticMarkup(React.createElement(Handler, locals));
    callback(null, `<!DOCTYPE html>${html}`);
  });
}
