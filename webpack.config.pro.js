const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    render: './src/render/index.js',
    readme: './src/readme/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.css$/
              },
            },
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|otf)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
    ],
  },
};
