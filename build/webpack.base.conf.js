var path = require('path')
var config = require('../config/index')
var webpack = require('webpack')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var standardSettings = require('standard-settings')
var settings = require('nconf').get()

module.exports = {
  plugins: [
    new webpack.DefinePlugin({ SETTINGS: JSON.stringify(settings) })
  ],
  entry: {
    app: './src/main.js'
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },
  output: {
    path: config.build.assetsRoot,
    // this causes absolute path in builds, which makes them non-distribuable on an other machine
    // we may not need this in nd at all
    // so let's remove it on august, 22th 2016 if no one complains
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js'
  },
  target: settings.target || 'web',
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  vue: {
    autoprefixer: {
      browsers: ['last 2 versions']
    },
    loaders: utils.cssLoaders()
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ]
}
