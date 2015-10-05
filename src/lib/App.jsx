import React, { PropTypes } from 'react';
import { RouteHandler } from 'react-router';


export default class App {
  static propTypes = {
    title: PropTypes.string,
    assets: PropTypes.object,
  }

  render() {
    return (
      <html>
      <head>
        <title>{this.props.title}</title>
      </head>
      <body>
        <RouteHandler {...this.props} />

        <script src={this.props.assets.main}></script>
      </body>
      </html>
    );
  }
}
