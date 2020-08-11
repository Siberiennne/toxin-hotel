const path = require('path');
const fs = require('fs')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}

const PAGES_DIR = `${PATHS.src}/pug/pages`;
const STYLES_DIR = `${PATHS.src}/assets/styles`;
const IMAGES_DIR = `${PATHS.src}/assets/img`;
const IMAGES = fs.readdirSync(IMAGES_DIR).filter(fileName => fileName.endsWith('.scss'))
const STYLE = fs.readdirSync(STYLES_DIR).filter(fileName => fileName.endsWith('.scss'))

const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  mode: 'development',
  context: PATHS.src,
  entry: {
    color_type: ['./pug/pages/color_type.js', './assets/styles/index.scss'],
    header_footer: ['./pug/pages/header_footer.js', './assets/styles/index.scss'],
  },
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
        'css-loader', 'sass-loader'
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
      filename: 'assets/css/index.[contenthash].css'
    }),

    // ...PAGES.map(page => new HtmlWebpackPlugin({
    //   template: `${PAGES_DIR}/${page}`,
    //   filename: `./${page.replace(/\.pug/, '.html')}`
    // }))

    new HtmlWebpackPlugin({
      template: PAGES_DIR + '/color_type.pug',
      filename: 'pages/color_type.html'
    }),

    new HtmlWebpackPlugin({
      template: PAGES_DIR + '/header_footer.pug',
      filename: 'pages/header_footer.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets/img',
          to: 'assets/img',
        }
      ]
    }),
    new CleanWebpackPlugin()
  ]
};