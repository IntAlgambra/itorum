/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'temp'),
  },
  devServer: {
    clientLogLevel: 'silent',
    stats: 'minimal',
    historyApiFallback: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        }],
      },
    ],
  },
};
