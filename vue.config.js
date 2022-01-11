'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const PRV_CONFIG = require('./private')
// const sharedPath = function(path) {
//   return `${PRV_CONFIG.BASE_SHARED}${path}`
// }

const name = '组件库' // page title

const Timestamp = new Date().getTime()

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: PRV_CONFIG.SEV_CONF,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@libs': resolve('src/libs'),
        '@com': resolve('src/components')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        // 修改打包后css文件名
        filename: `static/css/[name].${Timestamp}.css`,
        chunkFilename: `static/css/[name].${Timestamp}.css`
      })
    ],
    output: {
      filename: `static/js/[name].${Timestamp}.js`,
      chunkFilename: `static/js/[name].${Timestamp}.js`
    }
  },
  // 在exports中添加，这里很关键，不配置不行
  // transpileDependencies: ['element-ui'],

  chainWebpack(config) {
    // config.entry('main').add('babel-polyfill') // main是入口js文件
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
