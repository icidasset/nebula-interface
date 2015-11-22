import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import nearest from 'find-nearest-file';
import path from 'path';

import postAtroot from 'postcss-atroot';
import postCalc from 'postcss-calc';
import postColorFunction from 'postcss-color-function';
import postCustomProperties from 'postcss-custom-properties';
import postCustomMedia from 'postcss-custom-media';
import postFunctions from 'postcss-functions';
import postMediaMinmax from 'postcss-media-minmax';
import postMixins from 'postcss-mixins';
import postNested from 'postcss-nested';
import postNormalize from 'postcss-normalize';
import postPartialImport from 'postcss-partial-import';
import postPropertyLookup from 'postcss-property-lookup';
import postPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postPseudoelements from 'postcss-pseudoelements';
import postSelectorMatches from 'postcss-selector-matches';
import postSelectorNot from 'postcss-selector-not';
import postSimpleVars from 'postcss-simple-vars';


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
    'style',
    `css?${JSON.stringify(cssLoaderConfig)}` +
      `!postcss?`,
  ];

  const primaryFiles = [
    path.join(root, 'src', 'main.pcss'),
    path.join(root, 'src', 'static.pcss'),
  ];

  return {
    module: {
      loaders: [{
        test: /\.pcss$/,
        include: primaryFiles,
        loader: ExtractTextPlugin.extract(
          loaderOptions[0],
          loaderOptions[1] + JSON.stringify({
            pack: 'withNormalize',
            parser: 'postcss-safe-parser',
          }),
        ),
      }, {
        test: /\.pcss$/,
        exclude: primaryFiles,
        loader: ExtractTextPlugin.extract(
          loaderOptions[0],
          loaderOptions[1] + JSON.stringify({
            parser: 'postcss-safe-parser',
          }),
        ),
      }],
    },

    postcss() {
      const defaults = [
        postPartialImport({
          extension: 'pcss',
          prefix: ''
        }),

        postFunctions({
          functions: {

            // 12px: grid
            // 16px: default font-size
            grid(number) {
              const sizeInRem = parseFloat(number) * (12 / 16);
              // e.g. 1 = 1 column of 12px
              return sizeInRem.toString() + 'rem';
            }

          }
        }),

        postMixins,

        postSimpleVars,
        postCustomProperties,
        postColorFunction,

        postAtroot,
        postNested,

        postCalc,
        postCustomMedia,
        postMediaMinmax,

        postPseudoelements,
        postSelectorMatches,
        postSelectorNot,
        postPseudoClassAnyLink,
        postPropertyLookup,

        autoprefixer({ browsers: ['last 2 versions'] }),
      ];

      return {
        defaults: defaults,
        withNormalize: [postNormalize()].concat(defaults),
      };
    },

    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css'),
    ],
  };
}
