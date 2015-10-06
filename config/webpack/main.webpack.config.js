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
  },

  target: 'web',
  context: root,

  output: {
    libraryTarget: 'umd',
    filename: '[name].[hash].js',
    publicPath: '/',
    path: path.join(root, 'build'),
  },
};

export default partial(
  config,
  'babel',
  'css'
);
