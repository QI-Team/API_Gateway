const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

console.log('NODE_ENV: ', process.env.NODE_ENV);

module.exports = {
  mode: 'development',
  entry: ['react-hot-loader/patch', resolve(__dirname, 'src/app.tsx')],// resolve(__dirname, 'src/app.js'),
  output: {
    path: resolve(__dirname, 'bundle'),
    filename: "app-[hash:8].bundle.js",
    chunkFilename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      include: resolve(__dirname, 'src'),
      loader: 'ts-loader',
    }, {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }, {
      test: /\.(sa|sc|c)ss$/,
      // use: ['style-loader', 'css-loader'],
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: resolve(__dirname, 'src'),
          hmr: process.env.NODE_ENV !== 'production'
        }
      }, 'css-loader',
        'sass-loader', {
          loader: 'sass-resources-loader',
          options: {
            resources: resolve(__dirname, 'src/style/global.scss')
          }
        }]
    }, {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            name: "[name]-[hash:5].min.[ext]",
            limit: 20000, // size <= 20KB
            publicPath: "static/",
            outputPath: "static/"
          }
        }
      ]
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: "index.html",
      cache: true
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV !== 'production' ? 'dist/css/[name].css' : 'dist/css/[name].[hash-8].css',
      chunkFilename: process.env.NODE_ENV !== 'production' ? 'dist/css/[id].css' : 'dist/css/[id].[hash-8].css'
    }),
    new webpack.DefinePlugin({// todo
      'process.env.FETCH_URL': process.env.NODE_ENV === 'poduction' ? JSON.stringify('http://localhost:8889')  : JSON.stringify('http://localhost:8889'),
    })
  ],
  devServer: {
    contentBase: resolve(__dirname, './'),
    // publicPath: '/dist/',
    compress: true,
    hot: true,
    port: 5000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/': 'http://localhost:8889'
    }
  }
};
