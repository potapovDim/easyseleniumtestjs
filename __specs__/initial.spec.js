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
  .element('searchButton', 'input[value="Go"]')
  .elements('electronicBooks', '.a-section.a-spacing-medium')
  .sendKeys('searchField', 'kindle')
  .clickElements('electronicBooks', 1)
  .click('searchButton')
  .saveWorkflow()



async function baseUp() {

  await client
    .initWorkflow('amazonSearch', {field: 'kindle'})
    .exec()
}

baseUp()
