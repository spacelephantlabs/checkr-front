const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const outputPathName = 'dist';
const rootPathFromHere = '../';
const outputPath = rootPathFromHere + outputPathName;

module.exports = {
  entry: {
    main: [
      './src/ts/main.ts',
      './src/styles/main.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, outputPath),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:data-src'],
              interpolate: require,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([outputPathName], {
      root: path.resolve(__dirname, rootPathFromHere),
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      title: 'Sample front',
      inject: 'body',
    })
  ],
};
