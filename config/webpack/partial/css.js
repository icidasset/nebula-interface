import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import csspartialimport from 'postcss-partial-import';
import postcss_normalize from 'postcss-normalize';
import precss from 'precss';


export default function css() {
  const cssLoaderConfig = {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]-[local]-[hash:base64:5]',
  };

  const postcssLoaderConfig = {
    parser: 'postcss-scss',
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
        loader: ExtractTextPlugin.extract(
          'style-loader',
          `css-loader`
        ),
      }],
    },

    postcss() {
      return [
        postcss_normalize(),
        csspartialimport({ extension: 'scss' }),
        precss,
        autoprefixer({ browsers: ['last 2 versions'] }),
      ];
    },

    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
}
