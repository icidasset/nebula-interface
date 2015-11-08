import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import csspartialimport from 'postcss-partial-import';
import nearest from 'find-nearest-file';
import path from 'path';
import postcssNormalize from 'postcss-normalize';
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

  const loaderOptions = [
    'style-loader',
    `css-loader?${JSON.stringify(cssLoaderConfig)}` +
      `!postcss-loader?`,
  ];

  const primaryFiles = [
    path.join(root, 'src', 'main'),
    path.join(root, 'src', 'static'),
  ];

  return {
    module: {
      loaders: [{
        test: /\.(scss|sass)$/,
        include: primaryFiles,
        loader: ExtractTextPlugin.extract.apply(
          this,
          [
            loaderOptions[0],
            loaderOptions[1] + JSON.stringify({
              pack: 'withNormalize',
              parser: 'postcss-scss',
            }),
          ]
        ),
      }, {
        test: /\.(scss|sass)$/,
        exclude: primaryFiles,
        loader: ExtractTextPlugin.extract.apply(
          this,
          [
            loaderOptions[0],
            loaderOptions[1] + JSON.stringify({
              parser: 'postcss-scss',
            }),
          ]
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
      const defaults = [
        csspartialimport({ extension: 'scss' }),
        precss,
        autoprefixer({ browsers: ['last 2 versions'] }),
      ];

      return {
        defaults: defaults,
        withNormalize: [postcssNormalize()].concat(defaults),
      };
    },

    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
}
