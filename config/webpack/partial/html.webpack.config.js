import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';

import data from '../../data';


export default function html() {
  return {
    // Module settings.
    plugins: [
      new StaticSiteGeneratorPlugin('main', data.routes, data),
    ],
  };
}
