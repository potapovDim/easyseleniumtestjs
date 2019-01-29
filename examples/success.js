const {Client} = require('../src/client/client')

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

async function initialTest() {

  await client
    .init()
    .go('https://qa7.e-builder.net/www/index.aspx?ReturnUrl=%2f')
    .element('username', '#Username')
    .element('password', '#Password')
    .element('loginButton', 'input[value="Log In"]')
    .sendKeys('username', 'sryan')
    .sendKeys('password', 'test123!')
    .click('loginButton')
    .element('account', 'select[name="selAccount"]')
    .sendKeys('account', 'QA Regression General Invoices')
    .end()
    .saveWorkflow('sryanLogin')
    .exec()

  await client
    .initWorkflow('sryanLogin')
    .exec()
}

initialTest()
  // .wait(2500, 200)
  // .elementVisible('submitButton', '.FPdoLc.VlcLAe [name="btnK"]')
  // .sendKeys('googleInput', 'test super test')
  // .element('submitButton', '.FPdoLc.VlcLAe [name="btnK"]')
  // .getText('submitButton')
  // .click('submitButton')
  // .url()
  // .title()
  // .sleep(5000)