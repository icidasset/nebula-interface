import nearest from 'find-nearest-file';
import path from 'path';


const root = path.dirname(
  nearest('package.json')
);


export default function babel() {
  return {
    module: {
      loaders: [{
        name: 'babel',
        test: /\.jsx?$/,
        include: path.join(root, 'src'),
        loader: 'babel-loader',
        query: {
          stage: 0,
          optional: ['runtime'],
        },
      }],
    },
  };
}
