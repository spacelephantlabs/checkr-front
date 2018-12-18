const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const circleciPath = '.circleci';

module.exports = merge({
  customizeObject(a, b, key) {
    if (key === 'module') {
      // Custom merging
      return merge.smart({}, a, b);
    }

    // Fall back to default merging
    return undefined;
  },
})(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: './js/[name]_[hash:5].js',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name]_[hash:5].css',
    }),

    new FaviconsWebpackPlugin({
      logo: './src/images/icon.png',
      prefix: './images/favicons-[hash:5]/',
      inject: true,
      persistentCache: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),

    new FaviconCopyPlugin(),
    
    new CopyWebpackPlugin(
      [
        {
          // Circleci config to avoid build error, for eg., on gh-pages branch
          from: circleciPath + '/config.yml',
          to: path.resolve(baseConfig.output.path, circleciPath),
        },
      ],
      { debug: 'warning' },
    ),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: '%%COMMIT_HASH%%',
                  replace: new GitRevisionPlugin().commithash(),
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: [
              {
                loader: 'url-loader',
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  bypassOnDebug: true,
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'images/[name]_[hash:5].[ext]',
                },
              },
              {
                loader: 'image-webpack-loader',
              },
            ],
          },
        ],
      },
    ],
  },
});

function FaviconCopyPlugin() {
  var apply = function apply(compiler) {
    compiler.plugin('after-emit', function(compilation, callback) {
      const SRC_VALUE = 'images/favicons-*/favicon.ico';
      const DEST_VALUE = 'favicon.ico';

      var outputPath = compiler.options.output.path;
      var srcPath = path.join(outputPath, SRC_VALUE);
      srcPath = glob.sync(srcPath)[0];
      var dest = path.join(outputPath, DEST_VALUE);

      fs.createReadStream(srcPath).pipe(fs.createWriteStream(dest));

      callback();
    });
  };

  return {
    apply: apply,
  };
}
