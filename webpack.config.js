var webpack = require('webpack');

var path = require('path');  
var HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {  
    entry: [
      './app/src/index.tsx'
    ],
    devtool: 'source-map',
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
          },
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          },
          {
            test: /\.svg$/,
            use: ExtractTextPlugin.extract({
              use: 'svg-inline-loader'
            })
          },
          {
            //why?????????????
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 400
                }
              }
            ]
          }
        ],
        loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['react-hot'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    devServer: {
      contentBase: path.resolve(ROOT_PATH, '/build/app'),
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      disableHostCheck: true,
      port:443
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlwebpackPlugin({
        title: 'Shared Value Experience'
      }),
      new ExtractTextPlugin('style.css')      
    ]
  };