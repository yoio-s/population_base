const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue',
  //     // 'element-ui': 'ELEMENT',
  //     //   'vue-router': 'VueRouter',
  //     //   'vuex': 'Vuex',
  //     XLSX: 'xlsx',
  //
  //   },
  // },
  publicPath: '/pop_base',
  outputDir: 'population_base',
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "高新区基础库"
      return args
    })
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
    // 打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ])
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/assets/css/global.scss";',
      },
    },
  },
  devServer: {
    proxy: {
      '/apis': {
        target: 'https://gxfw.web.cdyoue.com',
        changOrigin: true,
      },
    },
  },
  productionSourceMap: false,
}
