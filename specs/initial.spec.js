
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



await client
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

await client
  .initWorkflow('sryanLogin')
  .exec()
}


module.exports = {
  'Some initial spec example for sryanLogin': async () => {
    await client
      .initWorkflow('sryanLogin')
      .exec()
  },
  'Next initial spec for other login': async () => {
    await client
      .initWorkflow('sryanLogin')
      .exec()
  }
}