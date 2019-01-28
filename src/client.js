const {buildSeleniumAPI} = require('./requests_map')
const {findSessionIdValue, findElementIdValue} = require('./util')
const {assertNumber, assertArray, assertFunction, assertString} = require('./is_type')


const sleep = (ms) => new Promise(_ => setTimeout(() => _(true), ms))

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

  end() {
    this.queue.push((async () => {
      const {sessionId} = this; await this.closeSession({sessionId})
    }).bind(this))

    return this
  }

  sleep(time = 5000) {
    this.queue.push((async () => {
      await sleep(time)
    }).bind(this))
    return this
  }

  element(elementName, cssSelector) {
    this.queue.push((async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const item = await this.getElement({sessionId, selectorObj: css})
      this.elementsStore[elementName] = {}; this.elementsStore[elementName]['elementId'] = findElementIdValue(item)
    }).bind(this))

    return this
  }

  click(elementName) {
    this.queue.push((async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.elementClick({sessionId, elementId})
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
      const {elementId} = this.elementsStore[elementName]
      await this.elementSendKeys({sessionId, elementId, text, value})
    }).bind(this))

    return this
  }

  getText(elementName, asserter) {
    this.queue.push((async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      const {value} = await this.elementText({sessionId, elementId})

      this.elementsStore[elementName]['text'] = value

      if(asserter) {asserter(value)}
    }).bind(this))
    return this
  }

  visible(elementName, asserter) {

  }

  wait(time, pollInterval = 200) {
    return {
      elementVisible: (elementName, cssSelector) => {

        this.queue.push((async () => {
          const css = {using: 'css selector', value: cssSelector}
          let isVisible = false; const now = +Date.now()

          let element = this.elementsStore[elementName]

          const {sessionId} = this
          if(!element) {
            do {
              const elementId = findElementIdValue(await this.getElement({sessionId, selectorObj: css}), '', false)
              if(elementId) {this.elementsStore[elementName] = {}; this.elementsStore[elementName].elementId = elementId}
              element = this.elementsStore[elementName]
            } while((await sleep(pollInterval)) && !element && +Date.now() - now < time)
            time = +Date.now() - now
          }
          const {elementId} = this.elementsStore[elementName]
          do {
            isVisible = await this.elementDisplayed({sessionId, elementId})
          } while((await sleep(pollInterval)) && !isVisible && +Date.now() - now < time)
        }).bind(this))
        return this

      },
      elementPresents: () => {

      },
      elementCount: () => {

      },
      urlContains: () => {

      }
    }
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

module.exports = {
  Client
}