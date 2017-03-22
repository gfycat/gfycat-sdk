const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV || 'development';
const __DEV__ = env === 'development';
const __PROD__ = env === 'production';

module.exports = {
  entry: './src/es5-gfycat-sdk',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: __DEV__ ? 'gfycat-sdk.umd.bundle.js' : 'gfycat-sdk.umd.bundle.min.js',
    publicPath: '/assets/',
    library: 'GfycatSDK',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  target: 'web',
  plugins: __PROD__ ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ] : [],
  watch: __DEV__
};
