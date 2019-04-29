const {Client} = require('../src/client')
const assert = require('assert')



const config = {
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

const client = new Client(config)

client
  .startWorkflow('amazonSearch')
  .init()
  .go('https://www.amazon.com/')
  .element('searchField', '#twotabsearchtextbox')
  .element('searchButton', 'input[value="Go"]')
  .sendKeys('searchField', 'Kindle')
  .click('searchButton')
  .sleep(2500)
  .elements('electronicBooks', '.a-section.a-spacing-medium .a-link-normal.a-text-normal')
  .clickElements('electronicBooks', 1)
  .element('productTitle', '#productTitle')
  .getText('productTitle', (text) => assert.equal(text.includes('Kindle'), true))
  .back()
  .saveWorkflow()



async function baseUp() {

  await client
    .initWorkflow('amazonSearch')
    .exec()
}

baseUp()
