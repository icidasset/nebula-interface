import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import nearest from 'find-nearest-file';
import path from 'path';
import csspartialimport from 'postcss-partial-import';
import precss from 'precss';


const root = path.dirname(
  nearest('package.json')
);


export default function css() {
  const cssLoaderConfig = {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]-[local]-[hash:base64:5]',
  };

  const postcssLoaderConfig = {
    parser: "postcss-scss"
  };

  return {
    module: {
      loaders: [{
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          `css-loader?${JSON.stringify(cssLoaderConfig)}` +
            `!postcss-loader?${JSON.stringify(postcssLoaderConfig)}`
        ),
      }, {
        test: /\.(css)$/,
        include: path.join(root, 'node_modules'),
        loader: ExtractTextPlugin.extract(
          'style-loader',
          `css-loader`
        ),
      }],
    },

    postcss() {
      return [
        csspartialimport(),
        precss,
        autoprefixer({ browsers: ['last 2 versions'] }),
      ];
    },

    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
}
