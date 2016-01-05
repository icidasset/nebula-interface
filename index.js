/* globals __dirname process */

import dotenv from 'dotenv';
import fs from 'fs';
import ms from 'metalsmith';
import msDefine from 'metalsmith-define';
import msFilenames from 'metalsmith-filenames';
import msInPlace from 'metalsmith-in-place';
import msLayouts from 'metalsmith-layouts';
import msPermalinks from 'metalsmith-permalinks';
import msRename from 'metalsmith-rename';
import msServe from 'metalsmith-serve';
import msSvgSprite from 'metalsmith-svg-sprite';
import msWatch from 'metalsmith-watch';
import msWebpack from 'ms-webpack';

import webpackConfig from './config/webpack';

const envFile = fs.readFileSync('./.env');
const envVariables = dotenv.parse(envFile);

envVariables.FIREBASE_URL = (
  process.env.FIREBASE_URL || envVariables.DEFAULT_FIREBASE_URL
);

const watchPaths = {
  '${source}/**/*': true,
  'src/**/*': '**/*',
};

const serveOptions = {
  port: 8080,
  verbose: true,
  http_error_files: { 404: '/200.html' }, // eslint-disable-line
};

const templateOptions = {
  pattern: '*.hbs',
  engine: 'handlebars',
  partials: 'partials',
  env: process.env.NODE_ENV,
};

const layoutOptions = Object.assign(
  {},
  templateOptions,
  {
    default: 'default.hbs',
  }
);

const m = ms(__dirname);

m.source('metal');

m.use(msDefine({ envVariables: JSON.stringify(envVariables) }));
m.use(msWebpack(webpackConfig));
m.use(msSvgSprite(compileSvgSpriteConfig()));
m.use(msFilenames());
m.use(msInPlace(templateOptions));
m.use(msLayouts(layoutOptions));
m.use(msRename([ [ '.hbs', '.html' ] ]));
m.use(msPermalinks({ relative: false }));

if (process.env.SERVE) m.use(msServe(serveOptions));
if (process.env.WATCH) m.use(msWatch({ paths: watchPaths }));

m.build(function buildCallback(err) {
  if (err) throw err;
});

/**
 * Icon settings
 *
 * @author Neal Granger (@nealgranger)
 * @returns {Object} config for metalsmith-svg-sprite
 */
function compileSvgSpriteConfig() {
  return {
    mode: { symbol: {
      dest: '.',
      sprite: 'sprite.svg',
      render: {
        html: {
          template: 'layouts/icons.hbs',
          dest: 'icons',
        },
      },
    } },
  };
}
