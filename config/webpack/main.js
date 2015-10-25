import nearest from 'find-nearest-file';
import partial from 'webpack-partial';
import path from 'path';


const root = path.dirname(
  nearest('package.json')
);


const config = {
  id: 'main',

  entry: {
    main: [
      path.join(root, 'src', 'main.js'),
      path.join(root, 'src', 'main.scss'),
    ],
    static: [
      path.join(root, 'src', 'static.js'),
      path.join(root, 'src', 'static.scss'),
    ],
  },

  target: 'web',
  context: root,
  cache: false,

  output: {
    libraryTarget: 'umd',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
    publicPath: '/',
    path: path.join(root, 'build'),
  },
};

export default partial(
  config,
  './partial/css.js',
  './partial/javascript.js',
  './partial/images.js'
);
