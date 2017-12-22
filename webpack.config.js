var webpack = require('webpack');

var path = require('path');  
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {  
    entry: [
      './app/src/index.tsx'
    ],
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(ROOT_PATH, '/build'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    module:{
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ],
        loaders: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['react-hot', 'babel'],
        }]
    },
    devServer: {
        contentBase: path.resolve(ROOT_PATH, '/build'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlwebpackPlugin({
        title: 'Listlogs'
      })
    ]
  };