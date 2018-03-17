var webpack = require('webpack');

var path = require('path');  
var HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {  
    entry: [
      './app/src/index.tsx'
    ],
    devtool: 'source-map',
    output: {
      path: ROOT_PATH +  '/dist/assets',
      publicPath: '/assets/',
      filename: '[name].bundle.js'
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
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  limit: 5000
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
      port:443,
      disableHostCheck: true
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new HtmlwebpackPlugin({
        title: 'Shared Value Experience',
        filename: "index.html"
      }),
      new ExtractTextPlugin('style.css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
      new UglifyJSPlugin()
    ]
  };