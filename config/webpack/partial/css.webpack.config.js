import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import cssimport from 'postcss-import';
import precss from 'precss';


export default function css() {
  const cssLoaderConfig = {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]-[local]-[hash:base64:5]',
  };

  return {
    module: {
      loaders: [{
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          `css-loader?${JSON.stringify(cssLoaderConfig)}!postcss-loader`
        ),
      }],
    },

    css() {
      return [
        cssimport({ onImport: files => files.forEach(this.addDependency) }),
        precss,
        autoprefixer({ browsers: ['last 2 versions'] }),
      ];
    },

    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
}
