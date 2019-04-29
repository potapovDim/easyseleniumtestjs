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

client
  .startWorkflow('amazonSearch')
  .init()
  .go('https://www.amazon.com/')
  .element('searchField', '#twotabsearchtextbox')
  .sendKeys('searchField')
  .saveWorkflow()



async function baseUp() {

  await client
    .initWorkflow('amazonSearch', {field: 'kindle'})
    .exec()
}

baseUp()
