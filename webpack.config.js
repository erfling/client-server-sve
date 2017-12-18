module.exports = {  
    entry: [
      './app/src/index.ts'
    ],
    devtool: 'inline-source-map',
    output: {
      path: __dirname + '/app/build',
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
          ]
    },
    devServer: {
      contentBase: './app/build'
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    }
  };