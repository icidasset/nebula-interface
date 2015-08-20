export default function babel() {
  return {
    // Module settings.
    module: {
      loaders: [{
        name: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          // Babel is for ES6 + JSX features; since we use it so much
          // we'll keep the runtime separate to save on space.
          'babel?optional[]=runtime&optional[]=optimisation.react.constantElements&optional[]=es7.classProperties&optional[]=es7.decorators',
        ],
      }],
    },
  };
}
