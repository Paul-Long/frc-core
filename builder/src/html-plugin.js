'use strict';
const fs = require('fs');
const mkdirp = require('mkdirp');
const resolve = require('path').resolve;
const dirname = require('path').dirname;
const Base64 = require('js-base64').Base64;
const HtmlWebpackPlugin = require('html-webpack-plugin');

function write(options) {
  const {initialState, favicon, filename, outputPath, html, entryName} =
    options || {};
  let assets = options.assets;
  if (typeof assets === 'function') {
    assets = assets({entryName});
  }
  let assetsStr = '';
  if (typeof assets === 'string') {
    if (assets.endsWith('.css')) {
      assetsStr = `<link href="${assets}" rel="stylesheet">`;
    } else if (assets.endsWith('.js')) {
      assetsStr = `<script src="${assets}"></script>`;
    }
  } else if (assets instanceof Array) {
    assets.forEach((a) => {
      if (a.endsWith('.css')) {
        assetsStr += `<link href="${a}" rel="stylesheet">`;
      } else if (a.endsWith('.js')) {
        assetsStr += `<script src="${a}"></script>`;
      }
    });
  }
  if (favicon) {
    assetsStr += `<link rel="icon" href="${favicon}" rel="shortcut icon" type="image/x-icon">`;
  }
  if (initialState) {
    const initStr = `<script>window.__INITIAL_STATE__ = "${Base64.encode(
      JSON.stringify(initialState || {})
    )}"</script>`;
    assetsStr = initStr + assetsStr;
  }
  let wHtml = html.replace('<!--<html-static-before-plugin>-->', assetsStr);
  const fullPath = resolve(outputPath, filename);
  const directory = dirname(fullPath);
  const made = mkdirp.sync(directory);
  console.log('mkdirp made = ', made);
  let ret = fs.writeFileSync(fullPath, wHtml);
  console.log('fs write file ', ret, fullPath);
  return assetsStr;
}

module.exports = function({otherConfig, webpackConfig, entryName, prefix}) {
  return new HtmlWebpackPlugin({
    title: '',
    filename: 'index.html',
    template: resolve(__dirname, 'webpack/index.html'),
    alterChunks: function(htmlPluginData, chunks) {
      if (entryName) {
        return chunks.filter((c) =>
          (c.names || []).some((n) => n.includes(entryName))
        );
      }
      return chunks;
    },
    afterHtmlProcessing: function(htmlPluginData) {
      const html = htmlPluginData.html;
      ['dev', 'qa', 'prd'].forEach((env) => {
        let filename = `index.${env}.html`;
        if (entryName && entryName !== 'index') {
          filename = `${prefix}/html/${entryName}/index.${env}.html`;
        }
        write({
          ...otherConfig[env],
          filename,
          entryName,
          outputPath: webpackConfig.output.path,
          html
        });
      });
      return htmlPluginData;
    },
    inject: true,
    minify: {
      removeComments: false,
      collapseWhitespace: false
    }
  });
};
