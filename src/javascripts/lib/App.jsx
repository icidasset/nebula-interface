import React from 'react';
import { RouteHandler } from 'react-router';


export default class App {
  static propTypes = {
    title: 'TODO',
  };

  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          <RouteHandler {...this.props} />
        </body>
      </html>
    );
  }
}
