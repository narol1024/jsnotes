const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    esm: './esm/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map[query]',
  },
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin()],
};
