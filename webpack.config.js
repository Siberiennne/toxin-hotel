const path = require('path');
const fs = require('fs');

const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}

const PAGES_ENTRY_DIR = `${PATHS.src}/pages`;
const PAGES_OUTPUT_DIR = "views/pages";
const STYLES_DIR = `${PATHS.src}/assets/styles`;
const IMAGES_DIR = `${PATHS.src}/assets/img`;
const IMAGES = fs.readdirSync(IMAGES_DIR).filter(fileName => fileName.endsWith('.scss'))
const STYLE = `${PATHS.src}/styles/index.scss`;

const PAGES = fs.readdirSync(PAGES_ENTRY_DIR).filter(fileName => fileName.endsWith('.pug'));

let pageTitles = ['color-type', 'header-footer', 'landing-page', 'form-elements', 'cards', 'search-room', 'room-details', 'registration', 'sign-in'];

module.exports = {
  mode: 'development',
  context: PATHS.src,
  entry: {},
  watch: true,
  output: {
    path: PATHS.dist,
    filename: 'assets/js/[name].[contenthash].js'
  },

  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader',
      query: {
        presets: [
          ["@babel/env", {
            "targets": {
              "browsers": "last 2 chrome versions"
            }
          }]
        ]
      }
    },
    {
      test: /\.pug$/,
      loader: 'pug-loader',
      options: {
        pretty: true
      }
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader?url=false', 'sass-loader'
      ],
    },
    // 
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader',
      ],
    },
    ]
  },

  resolve: {
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, "../src/assets/img"),
      fonts: path.resolve(__dirname, "../src/assets/fonts"),
    },
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets/img',
          to: 'assets/img',
        }
      ]
    }),
    new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

pageTitles.forEach((title) => {

  module.exports.entry[title] = [PAGES_ENTRY_DIR + `/${title}/${title}.js`, PAGES_ENTRY_DIR + `/${title}/${title}.scss`];

  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: PAGES_ENTRY_DIR + `/${title}/${title}.pug`,
      filename: PAGES_OUTPUT_DIR + `/${title}.html`,
      chunks: [title]
    })
  )
})