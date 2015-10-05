export default function babel() {
  return {
    // Module settings.
    module: {
      loaders: [{
        name: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          stage: 0,
          optional: ['runtime'],
          jsxPragma: 'createElement',
        },
      }],
    },
  };
}
