const {Client} = require('../src/client')

const temporaryConfig = {
  seleniumUrl: 'http://localhost:4444/wd/hub/',
  browser: {
    desiredCapabilities: {
      browserName: 'chrome',
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY'
    }
  }
}

const client = new Client(temporaryConfig)



client
  .init()

  .go('http://google.com')

  .element('googleInput', '[name="q"]')

  .wait(2500, 200)

  .elementVisible('submitButton', '.FPdoLc.VlcLAe [name="btnK"]')

  .sendKeys('googleInput', 'test super test')

  .element('submitButton', '.FPdoLc.VlcLAe [name="btnK"]')

  .getText('submitButton')

  .click('submitButton')
  .url()
  .title()
  .sleep(5000)

  .end()

  .exec()

