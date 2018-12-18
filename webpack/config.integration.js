const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./config.production.js');

module.exports = merge(
  {
    plugins: [
      new webpack.DefinePlugin({
        APP_DEBUG: JSON.stringify(true),
        APP_FIREBASE_ENV_NAME: JSON.stringify('integration'),
        APP_FIREBASE_API_KEY: JSON.stringify('AIzaSyDOLvfEUEh2K3iP_K_dYKZaKnm4VsHqCx4'),
        APP_FIREBASE_PROJECT_ID: JSON.stringify('unik-name-integration'),
        APP_FIREBASE_DATABASE_NAME: JSON.stringify('unik-name-integration'),
        APP_FIREBASE_BUCKET: JSON.stringify('unik-name-integration'),
        APP_FIREBASE_SENDER_ID: JSON.stringify('322065704769'),
      }),
    ],
  },
  baseConfig,
);
