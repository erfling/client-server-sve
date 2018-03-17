var webpack = require('webpack');

var path = require('path');  
var HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {  
    entry: [
      './app/src/index.tsx'
    ],
    devtool: false,
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
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new HtmlwebpackPlugin({
        title: 'Shared Value Experience',
        filename: "../index.html",
        template: "template.html"
      }),
      new ExtractTextPlugin('style.css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
      new UglifyJSPlugin()
    ]
  };
  //<meta name="google-site-verification" content="LJ1jS5T5gq2RSmbjAqtxgKB01F86s7iNm5BZ0Xi91Ak" />