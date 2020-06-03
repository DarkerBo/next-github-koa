const withBundleAnalyzer = require('@zeit/next-bundle-analyzer'); // 打包分析工具
const webpack = require('webpack');

module.exports = withBundleAnalyzer({
  webpack(webpackConfig) {
    webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return webpackConfig
  },
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
})