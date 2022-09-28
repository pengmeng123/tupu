const px2rem = require('postcss-px2rem')

// 使用等比适配插件
module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
        postcss: {
            plugins: [
                px2rem({
                    remUnit: 100,
                    "plugins": {
                        "autoprefixer": {},
                        "postcss-px2rem-exclude":{
                            "remUnit": 75,
                            "exclude":"/node_modules/i"
                        }
                    }
                })
            ]
        }
    }
  },
  devServer: {
    proxy: {
      '^/qcc': {
        target: 'http://z.test.greatld.com',
        changeOrigin: true,
      },
      '^/kzz/enterprise': {
        target: 'http://z.test.greatld.com',
        changeOrigin: true,
      },
      '/geoconv': {
        target: 'https://api.map.baidu.com/',
        secure: true,
      },
      '/routematrix': {
        target: 'https://api.map.baidu.com/',
        secure: true,
      },
      '/reverse_geocoding': {
        target: 'https://api.map.baidu.com/',
        secure: true,
      },
      '/geocoding': {
        target: 'https://api.map.baidu.com/',
        secure: true,
      },
    },
  },
}