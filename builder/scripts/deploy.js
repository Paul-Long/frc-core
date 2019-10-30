'use strict';

const webpack = require('webpack');
const Progress = require('webpack/lib/ProgressPlugin');
const chalk = require('chalk');
const ProgressBar = require('progress');
const {printStats, getConfig, buildCharts} = require('../src');

exports = module.exports = function(program) {
  const config = getConfig(program);
  if (program.analyzer) {
    config.config.plugins.push(
      new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin()
    );
  }
  const compiler = webpack(config.config);
  const messageTemplate = [':bar', chalk.green(':percent'), ':msg'].join(' ');
  const progressOptions = {
    complete: chalk.bgGreen(' '),
    incomplete: chalk.bgWhite(' '),
    width: 40,
    total: 100,
    clear: false
  };
  const bar = new ProgressBar(messageTemplate, progressOptions);
  compiler.apply(
    new Progress(function(percentage, msg) {
      bar.update(percentage, {msg: msg});
    })
  );
  function done(err, stats) {
    printStats(stats);
    if (config.option) {
      buildCharts(config.option, function(code) {
        process.exit(code);
      });
    }
  }
  compiler.run(done);
};
