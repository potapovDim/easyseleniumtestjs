const configFF = {
  seleniumUrl: 'http://localhost:4444/wd/hub/',
  browser: {
    desiredCapabilities: {
      browserName: 'firefox',
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY'
    }
  }
}


const configChrome = {
  seleniumUrl: 'http://localhost:4444/wd/hub/',
  browser: {
    desiredCapabilities: {
      browserName: 'firefox',
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY'
    }
  }
}

module.exports = {
  configFF,
  configChrome
}
