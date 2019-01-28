const {buildSeleniumAPI} = require('./requests_map')
const {findSessionIdValue, findElementIdValue} = require('./util')

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

class Client {
  constructor(config) {
    const {seleniumUrl, browser} = config
    this.capabilities = browser
    buildSeleniumAPI(this, seleniumUrl)
    this.queue = []
    this.sessionId = null
    this.elementsStore = {

    }
  }

  init() {
    this.queue.push((async () => {
      const item = await this.createSession({capabilities: this.capabilities})
      this.sessionId = findSessionIdValue(item)
    }).bind(this))
    return this
  }

  element(elementName, cssSelector) {
    this.queue.push((async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const item = await this.getElement({sessionId, selectorObj: css})
      console.log(item)
      const elementId = findElementIdValue(item)
      console.log(elementId, elementName)
    }).bind(this))
    return this
  }

  go(url) {
    this.queue.push((async () => {
      const {sessionId} = this
      await this.openUrl({sessionId, url})
    }).bind(this))
    return this
  }

  async exec() {
    for(const item of this.queue) {
      await item()
    }
  }
}

const cliedn = new Client(temporaryConfig)

cliedn
  .init()
  .go('http://google.com')
  .element('googleInput', '[name="q"]')
  .element('submitButton', '[name="btnK"]')
  .sendKeys('googleInput', 'test super test')
  .click('submitButton')
  .exec()