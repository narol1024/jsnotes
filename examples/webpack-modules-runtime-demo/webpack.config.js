const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    commonjs: './commonjs/main.js',
    esm: './esm/main.js',
    mixed: './mixed/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map[query]',
  },
  devtool: 'source-map',
};
