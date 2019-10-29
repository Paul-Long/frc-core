'use strict';

const webpack = require('webpack');
const Server = require('webpack-dev-server');
const chalk = require('chalk');
const {getConfig, buildCharts} = require('../src');

exports = module.exports = function(program) {
  const config = getConfig(program);
  if (config.option) {
    buildCharts(config.option, function(code) {});
  }
  const compiler = webpack(config.config);
  const server = new Server(compiler, config.config.devServer);
  server.listen(config.config.devServer.port, 'localhost', (err) => {
    if (err) {
      console.log(chalk.red('webpack-dev-server error'), err);
    }
  });
};
