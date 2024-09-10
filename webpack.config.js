const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' when you're ready to deploy
  entry: {
    popup: './popup.js',
    content: './content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: '[name].bundle.js' // Output bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Target all .js files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // Use preset-env for JavaScript
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html', // Output HTML
      template: './index.html' // Your source HTML
    })
  ]
};
