import nearest from 'find-nearest-file';
import partial from 'webpack-partial';
import path from 'path';
import webpack from 'webpack';

import cssConfig from './partial/css';
import imagesConfig from './partial/images';
import javascriptConfig from './partial/javascript';


const root = path.dirname(nearest('package.json'));
const minify = process.env.MINIFY === '1';


const config = {
  id: 'main',

  entry: {
    main: [
      path.join(root, 'src', 'main.js'),
      path.join(root, 'src', 'main.pcss'),
    ],
    static: [
      path.join(root, 'src', 'static.js'),
      path.join(root, 'src', 'static.pcss'),
    ],
  },

  context: root,

  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
    publicPath: '/',
    path: path.join(root, 'build'),
  },

  resolve: {
    alias: {
      querystring: 'querystring-browser',
    },
  },

  node: {
    fs: "empty",
  },

  plugins: (
    minify ?
      [ new webpack.optimize.UglifyJsPlugin({ minimize: true }) ] :
      [],

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.ENV}"`,
    }),
  ),
};

export default partial(
  config,
  cssConfig,
  imagesConfig,
  javascriptConfig
);
