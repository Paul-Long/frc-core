const assert = require('assert');
const PLUGIN_NAME = 'HtmlWebpackEventPlugin';

function HtmlWebpackEventPlugin(options) {
  assert.equal(
    options,
    undefined,
    PLUGIN_NAME + ' does not accept any options'
  );
}

HtmlWebpackEventPlugin.prototype.apply = function(compiler) {
  const self = this;

  // webpack 4
  if (compiler.hooks) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, function(compilation) {
      // Let plugins alter the chunks and the chunk sorting
      compilation.hooks.htmlWebpackPluginAlterChunks.tap(PLUGIN_NAME, function(
        chunks,
        htmlPluginData
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.alterChunks
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, chunks);
        return ret.data;
      });

      // Allow plugins to make changes to the assets before invoking the template
      // This only makes sense to use if `inject` is `false`
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
        PLUGIN_NAME,
        function(htmlPluginData, callback) {
          const eventFun = htmlPluginData
            ? htmlPluginData.plugin.options.beforeHtmlGeneration
            : null;
          const ret = self.callEventFun(
            eventFun,
            htmlPluginData,
            htmlPluginData
          );
          callback(ret.error, ret.data);
        }
      );

      // Allow plugins to change the html before assets are injected
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        PLUGIN_NAME,
        function(htmlPluginData, callback) {
          const eventFun = htmlPluginData
            ? htmlPluginData.plugin.options.beforeHtmlProcessing
            : null;
          const ret = self.callEventFun(
            eventFun,
            htmlPluginData,
            htmlPluginData
          );
          callback(ret.error, ret.data);
        }
      );

      // Allow plugins to change the assetTag definitions
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        PLUGIN_NAME,
        function(htmlPluginData, callback) {
          const eventFun = htmlPluginData
            ? htmlPluginData.plugin.options.alterAssetTags
            : null;
          const ret = self.callEventFun(
            eventFun,
            htmlPluginData,
            htmlPluginData
          );
          callback(ret.error, ret.data);
        }
      );

      // Allow plugins to change the html after assets are injected
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        PLUGIN_NAME,
        function(htmlPluginData, callback) {
          const eventFun = htmlPluginData
            ? htmlPluginData.plugin.options.afterHtmlProcessing
            : null;
          const ret = self.callEventFun(
            eventFun,
            htmlPluginData,
            htmlPluginData
          );
          callback(ret.error, ret.data);
        }
      );

      // Let other plugins know that we are done:
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
        PLUGIN_NAME,
        function(htmlPluginData, callback) {
          // htmlPluginData === undefined
          const eventFun = htmlPluginData
            ? htmlPluginData.plugin.options.afterEmit
            : null;
          const ret = self.callEventFun(
            eventFun,
            htmlPluginData,
            htmlPluginData
          );
          callback(ret.error, ret.data);
        }
      );
    });
  } else {
    compiler.plugin('compilation', function(compilation) {
      // Let plugins alter the chunks and the chunk sorting
      compilation.plugin('html-webpack-plugin-alter-chunks', function(
        chunks,
        htmlPluginData
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.alterChunks
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, chunks);
        return ret.data;
      });

      // Allow plugins to make changes to the assets before invoking the template
      // This only makes sense to use if `inject` is `false`
      compilation.plugin('html-webpack-plugin-before-html-generation', function(
        htmlPluginData,
        callback
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.beforeHtmlGeneration
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, htmlPluginData);
        callback(ret.error, ret.data);
      });

      // Allow plugins to change the html before assets are injected
      compilation.plugin('html-webpack-plugin-before-html-processing', function(
        htmlPluginData,
        callback
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.beforeHtmlProcessing
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, htmlPluginData);
        callback(ret.error, ret.data);
      });

      // Allow plugins to change the assetTag definitions
      compilation.plugin('html-webpack-plugin-alter-asset-tags', function(
        htmlPluginData,
        callback
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.alterAssetTags
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, htmlPluginData);
        callback(ret.error, ret.data);
      });

      // Allow plugins to change the html after assets are injected
      compilation.plugin('html-webpack-plugin-after-html-processing', function(
        htmlPluginData,
        callback
      ) {
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.afterHtmlProcessing
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, htmlPluginData);
        callback(ret.error, ret.data);
      });

      // Let other plugins know that we are done:
      compilation.plugin('html-webpack-plugin-after-emit', function(
        htmlPluginData,
        callback
      ) {
        // htmlPluginData === undefined
        const eventFun = htmlPluginData
          ? htmlPluginData.plugin.options.afterEmit
          : null;
        const ret = self.callEventFun(eventFun, htmlPluginData, htmlPluginData);
        callback(ret.error, ret.data);
      });
    });
  }
};

HtmlWebpackEventPlugin.prototype.callEventFun = function(
  eventFun,
  htmlPluginData,
  defaultData
) {
  const ret = {
    error: null,
    data: null
  };
  if (typeof eventFun === 'function') {
    try {
      ret.data = eventFun(htmlPluginData, defaultData);
    } catch (error) {
      ret.error = error;
    }
  } else {
    ret.data = defaultData;
  }
  return ret;
};

module.exports = HtmlWebpackEventPlugin;
