const {Client} = require('../src/client')


const config = {
  seleniumUrl: 'http://localhost:4444/wd/hub/',
  browser: {
    desiredCapabilities: {
      browserName: 'chrome',
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY'
    }
  }
  // }
  // browsers: {
}

const client = new Client(config)


async function baseUp() {
  await client
    .init()
    .go('https://www.amazon.com/')
    // .element('searchField', '#twotabsearchtextbox')
    // .sendKeys('searchField', 'kindle')
    .exec()
}

baseUp()