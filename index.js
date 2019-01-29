const runner = require('./src/runner')
const path = require('path')

runner({
  specsPath: path.resolve(__dirname, './specs'),
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
      }
    }
  }
})