export default function images() {
  return {
    module: {
      loaders: [{
        test: /\.(gif|jpe?g|png|tiff|svg)(\?.*)?$/,
        loader: 'file-loader',
      }],
    },
  };
}
