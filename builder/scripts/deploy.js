'use strict';

const webpack = require('webpack');
const Progress = require('webpack/lib/ProgressPlugin');
const chalk = require('chalk');
const {printStats, getConfig, buildCharts} = require('../src');

exports = module.exports = function(program) {
  const config = getConfig(program);
  if (program.analyzer) {
    config.config.plugins.push(
      new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin()
    );
  }
  if (program.electron) {
    config.config.target = 'electron-renderer';
  }
  const compiler = webpack(config.config);
  compiler.apply(
    new Progress(function(percentage, msg, current, active, modulepath) {
      modulepath = modulepath ? ' ' + modulepath : '';
      current = current ? ' ' + current : '';
      active = active ? ' ' + active : '';
      console.log(
        '[ ' +
          chalk.redBright(Number(percentage * 100).toFixed(2) + '%') +
          ' ] ' +
          chalk.green(msg + ' ' + current + ' ' + active + ' ' + modulepath)
      );
    })
  );
  function done(err, stats) {
    printStats(err, stats);
    if (config.option) {
      buildCharts(config.option, function(code) {
        process.exit(code);
      });
    }
  }
  compiler.run(done);
};
