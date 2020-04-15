const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'zhlint.js',
    libraryTarget: 'umd',
    library: 'zhlint'
  },
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'global.__DEV__': JSON.stringify(false)
    })
  ]
}
