const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/es5-gfycat-sdk',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gfycat-sdk.umd.bundle.min.js',
    publicPath: '/assets/',
    library: 'GfycatSDK',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  target: 'web',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ]
};
