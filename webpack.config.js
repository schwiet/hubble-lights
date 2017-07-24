var path = require( 'path' );
var webpack = require( 'webpack' );

var config = {
  context: path.resolve( __dirname, 'src/js/components' ),
  entry: {
    app: './app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015', 'react' ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  output: {
    path: path.resolve( __dirname + '/dist' ),
    filename: '[name].bundle.js',
    publicPath: '/js'
  },
  devServer: {
    contentBase: path.resolve( __dirname, './dist') 
  },
  resolve: {
    alias: {
      styles:        path.resolve( __dirname, 'src', 'styles' )
    },
    extensions: [ '*', '.js', '.css' ]
  }
};

config.resolve.alias[ 'hubble-lights' ] = path.resolve( __dirname, 'src', 'js' );

module.exports = config;
