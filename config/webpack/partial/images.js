export default function images() {
  return {
    module: {
      loaders: [{
        test: /\.(gif|jpe?g|png|tiff|svg)$/,
        loader: 'url?limit=10000&name=images/[hash:base64:5]-[name].[ext]',
      }],
    },
  };
}
