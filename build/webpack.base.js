const autoprefixer = require('autoprefixer')
const prefixer = require('postcss-prefixer')
const cssnano = require('cssnano')
const webpack = require('webpack')
const pkg = require('../package.json')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

process.traceDeprecation = true

const banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        prefixer({
          prefix: '_',
          ignore: [/luna-*/],
        }),
        autoprefixer,
        cssnano({
          preset: 'default',
        }),
      ],
    },
  },
}

const rawLoader = {
  loader: 'raw-loader',
  options: {
    esModule: false,
  },
}

module.exports = {
  entry: './src/index',
  resolve: {
    symlinks: false,
    alias: {
      axios: path.resolve(__dirname, '../src/lib/empty.js'),
      micromark: path.resolve(__dirname, '../src/lib/micromark.js'),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../test'),
    },
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/assets/',
    library: 'eruda',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../node_modules/luna-console'),
          path.resolve(__dirname, '../node_modules/luna-modal'),
          path.resolve(__dirname, '../node_modules/luna-tab'),
          path.resolve(__dirname, '../node_modules/luna-data-grid'),
          path.resolve(__dirname, '../node_modules/luna-object-viewer'),
          path.resolve(__dirname, '../node_modules/luna-dom-viewer'),
          path.resolve(__dirname, '../node_modules/luna-text-viewer'),
          path.resolve(__dirname, '../node_modules/luna-setting'),
          path.resolve(__dirname, '../node_modules/luna-box-model'),
          path.resolve(__dirname, '../node_modules/luna-notification'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          postcssLoader,
          { loader: 'sass-loader', options: { api: 'modern' } },
        ],
      },
      {
        test: /\.css$/,
        exclude: /luna-dom-highlighter/,
        use: ['css-loader', postcssLoader],
      },
      {
        test: /luna-dom-highlighter\.css$/,
        use: [rawLoader],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.DefinePlugin({
      VERSION: '"' + pkg.version + '"',
    }),
    new ESLintPlugin(),
  ],
}
