const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    render: './src/render/dev.js',
    readme: './src/readme/dev.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: true,
      template: './src/render/html/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'readme.html',
      minify: true,
      template: './src/readme/html/index.html',
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
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
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
          },
        ]
      },
    ],
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
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
    ],
  },
};
