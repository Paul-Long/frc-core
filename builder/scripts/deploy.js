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
  const compiler = webpack(config.config);
  compiler.apply(
    new Progress(function(percentage, msg, current, active, modulepath) {
      modulepath = modulepath
        ? ' …' + modulepath.substr(modulepath.length - 30)
        : '';
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
    if (err) {
      process.stdout.write(err + '\n');
    } else {
      printStats(stats);
      // process.stdout.write(stats.toString() + '\n');
    }
    console.log(chalk.green('Compiled successfully.\n'));

    if (config.option) {
      buildCharts(config.option, function(code) {
        process.exit(code);
      });
    }
  }
  compiler.run(done);
};
