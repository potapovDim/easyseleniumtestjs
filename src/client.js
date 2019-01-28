const {buildSeleniumAPI} = require('./requests_map')
const {findSessionIdValue, findElementIdValue} = require('./util')
const {assertNumber, assertArray, assertFunction, assertString} = require('./is_type')

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
      this.elementsStore[elementName] = findElementIdValue(item)
    }).bind(this))

    return this
  }

  click(elementName) {
    this.queue.push((async () => {
      const {sessionId} = this
      await this.elementClick({sessionId, elementId: this.elementsStore[elementName]})
    }).bind(this))

    return this
  }

  sendKeys(elementName, value) {
    let text = ''
    if(assertNumber(value)) {
      text = value.toString()
      value = value.toString().split('')
    } else if(!assertArray(value)) {
      text = value
      value = value.split('')
    } else {
      text = value.join('')
      value = value
    }
    this.queue.push((async () => {
      const {sessionId} = this
      await this.elementSendKeys({sessionId, elementId: this.elementsStore[elementName], text, value})
    }).bind(this))

    return this
  }

  getText(elementName) {
    this.queue.push((async () => {
      const {sessionId} = this
      const item = await this.elementText({sessionId, elementId: this.elementsStore[elementName]})
      console.log(item)
    }).bind(this))
    // const {sessionId} = this
    // this.elementText({sessionId, elementId: this.elementsStore[elementName]})
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

const client = new Client(temporaryConfig)

client
  .init()

  .go('http://google.com')

  .element('googleInput', '[name="q"]')
  .sendKeys('googleInput', 'test super test')

  .element('submitButton', '.FPdoLc.VlcLAe [name="btnK"]')
  .getText('submitButton')

  .exec()