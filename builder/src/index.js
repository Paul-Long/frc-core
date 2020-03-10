'use strict';
const fileSize = require('filesize');
const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname;
const join = require('path').join;
const resolve = require('path').resolve;
const merge = require('webpack-merge');
const spawn = require('win-spawn');
const Base64 = require('js-base64').Base64;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _webpackConfig = require('./webpack/webpack.config');
const _devWebpackConfig = require('./webpack/webpack.config.dev');
const _prdWebpackConfig = require('./webpack/webpack.config.prd');
const htmlPlugin = require('./html-plugin');

exports.printStats = function(err, stats) {
  if (err) {
    console.log(chalk.red(err));
    console.log(chalk.red('Compiled Failure.\n'));
    return;
  }
  let {assets, errors, warnings, time} = stats.toJson() || {};
  console.log('Time : ' + chalk.default(time) + 'ms');
  assets = assets.map((asset) => {
    return {
      size: fileSize(asset.size),
      name: asset.name
    };
  });
  const longestSize = Math.max.apply(
    null,
    assets.map((a) => a.size.length)
  );
  assets.forEach((asset) => {
    let size = asset.size;
    if (size.length < longestSize) {
      size += ' '.repeat(longestSize - size.length);
    }
    console.log('  ' + size + '  ' + chalk.cyan(asset.name));
  });
  console.log(chalk.yellow(` Warning (${(warnings || []).length})`));
  (warnings || []).forEach((err) => console.log(chalk.yellow(err)));
  if ((errors || []).length > 0) {
    console.log(chalk.red(` Error (${(errors || []).length})`));
    (errors || []).forEach((err) => console.log(chalk.red(err)));
    console.log(chalk.red('Compiled Failure.\n'));
    return;
  }
  console.log(chalk.green('Compiled Successfully.\n'));
};

exports.getConfig = function(program) {
  const allConfig = {
    babelImport: [
      [{libraryName: 'antd', style: true}, 'antd'],
      [{libraryName: 'frc-ui', style: true}, 'frc-ui'],
      [{libraryName: 'lodash'}, 'lodash']
    ]
  };
  const pkg = JSON.parse(fs.readFileSync(join(process.cwd(), 'package.json')));
  const isDev = program.env === 'development';
  allConfig.version = pkg.version;
  let config = require(join(process.cwd(), program.config));
  if (typeof config === 'function') {
    config = config(program);
  }

  let otherConfig = {dev: {}, qa: {}, prd: {}};
  if (Object.prototype.hasOwnProperty.call(config, 'otherConfig')) {
    otherConfig = config.otherConfig;
    delete config.otherConfig;
  }
  if (Object.prototype.hasOwnProperty.call(config, 'babelImport')) {
    allConfig.babelImport = [...allConfig.babelImport, ...config.babelImport];
    delete config.babelImport;
  }
  if (Object.prototype.hasOwnProperty.call(config, 'theme')) {
    allConfig.theme = config.theme;
    delete config.theme;
  }
  if (config.echarts) {
    allConfig.echarts = config.echarts;
    delete config.echarts;
  }
  let webpackConfig = _webpackConfig({
    env: program.env,
    prefix: program.prefix,
    entry: program.entry,
    indexPath: program.indexPath,
    title: program.title,
    otherConfig,
    babelImport: allConfig.babelImport,
    theme: allConfig.theme || {}
  });
  webpackConfig = merge(
    webpackConfig,
    isDev ? _devWebpackConfig : _prdWebpackConfig
  );
  if (typeof config.entry === 'object') {
    Object.keys(config.entry).forEach((entryName) => {
      webpackConfig.plugins.unshift(
        htmlPlugin({
          entryName,
          otherConfig,
          webpackConfig,
          prefix: program.prefix
        })
      );
    });
  } else {
    webpackConfig.plugins.unshift(
      htmlPlugin({otherConfig, prefix: program.prefix, webpackConfig})
    );
  }
  allConfig.config = merge(webpackConfig, config);
  if (allConfig.echarts) {
    const name = allConfig.echarts.filename || 'echarts.min';
    allConfig.option = {
      in: allConfig.echarts.in,
      out: join(
        allConfig.config.output.path,
        allConfig.echarts.out || `${program.prefix}/static/js/`,
        `${name}_${pkg.version}.js`
      )
    };
  }
  return allConfig;
};

exports.buildCharts = function(option, callback) {
  console.log(chalk.blue('Start build echarts....\n'));
  if (!option.in) {
    throw Error('echarts component index cannot ', echarts.in);
    return;
  }
  const sp = spawn(
    join(process.cwd(), 'node_modules/echarts/build/build.js'),
    ['--min', '-i', option.in, '-o', option.out],
    {stdio: 'inherit', customFds: [0, 1, 2]}
  );
  sp.on('close', function(code) {
    console.log(chalk.blue('Compiled build echarts successfully.\n'));
    callback(code);
  });
};
