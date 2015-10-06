import ms from 'metalsmith';
import msFilenames from 'metalsmith-filenames';
import msInPlace from 'metalsmith-in-place';
import msLayouts from 'metalsmith-layouts';
import msMetadata from 'metalsmith-metadata';
import msPermalinks from 'metalsmith-permalinks';
import msRename from 'metalsmith-rename';
import msServe from 'metalsmith-serve';
import msWatch from 'metalsmith-watch';
import msWebpack from 'metalsmith-webpack';

import webpackConfig from './config/webpack';


const m = ms(__dirname);
const templateOptions = {
  pattern: '*.hbs',
  engine: 'handlebars',
  partials: 'partials',
  env: process.env.NODE_ENV,
};

m.source('pages');
m.destination('build');

m.use(msWebpack(webpackConfig));
m.use(msFilenames());
m.use(msMetadata({}));
m.use(msInPlace(templateOptions));
m.use(msLayouts(Object.assign({}, templateOptions, { default: 'default.hbs' })));

// remove .hbs extension from compiled templates in build dir
m.use(msRename([['.hbs', '.html']]));

// remove .html extensions by setting each file as an index in a named dir
m.use(msPermalinks({ relative: false }));

// # watch, serve, etc.
if (process.env.SERVE) m.use(msServe({ port: 8080, verbose: true }));
if (process.env.WATCH) m.use(msWatch({ paths: { '${source}/**/*': true, 'src/**/*': '**/*' } }));

// # build
m.build(function buildCallback(err) {
  if (err) throw err;
});
