const webpack = require('webpack');
const resolve = require('path').resolve;

const BUILD_ENV = process.env.BUILD_ENV;
const config = {
  devtool: 'inline-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: resolve(process.cwd(), 'dist'),
    port: 3000,
    index: `index.${BUILD_ENV}.html`,
    hot: true,
    https: false,
    historyApiFallback: {
      index: `index.${BUILD_ENV}.html`
    },
    proxy: {
      '/cdbbond/api': {
        target: `http://qbweb.${BUILD_ENV}.sumscope.com:5100`,
        pathRewrite: {
          '^/cdbbond/api/': '/api/'
        }
      },
      '/node/api': {
        target: `http://qbweb.${BUILD_ENV}.sumscope.com:5100`,
        pathRewrite: {
          '^/node/api/': '/api/'
        }
      },
      '/rum': {
        target: 'http://172.16.66.182:5020'
      },
      '/workerbox': {
        target: `http://qbweb.${BUILD_ENV}.sumscope.com:28888`
      },
      '/web-library': {
        target: `http://qbweb.${BUILD_ENV}.sumscope.com:28888`
      }
    }
  }
};

module.exports = config;
