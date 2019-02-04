const {buildSeleniumAPI} = require('./requests_map')
const {findSessionIdValue, findElementIdValue} = require('./util')
const {assertNumber, assertArray, assertFunction, assertString} = require('./is_type')


const sleep = (ms) => new Promise(_ => setTimeout(() => _(true), ms))

class Client {
  constructor(config) {
    const {seleniumUrl, browser} = config

    buildSeleniumAPI(this, seleniumUrl)
    this.capabilities = browser
    this.queue = []
    this.sessionId = null
    this.elementsStore = {}
    this.workflows = {}
    this.currentWorkflow
  }

  initStep(step) {
    if(this.currentWorkflow) {
      this.workflows[this.currentWorkflow].push(step.bind(this))
    } else {
      this.queue.push(step.bind(this))
    }
  }

  endWorkflow() {
    this.currentWorkflow = null
    return this
  }

  init() {
    const step = async () => {
      const item = await this.createSession({capabilities: this.capabilities})
      console.log('!here!!!!!!!!!!!!!!!!!!!!')
      this.sessionId = findSessionIdValue(item)
    }
    this.initStep(step)
    return this
  }

  end() {
    const step = async () => {
      const {sessionId} = this; await this.closeSession({sessionId})
    }
    this.initStep(step)
    return this
  }

  sleep(time = 5000) {
    const step = async () => sleep(time)
    this.initStep(step)
    return this
  }

  element(elementName, cssSelector) {
    const step = async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const item = await this.getElement({sessionId, selectorObj: css})
      this.elementsStore[elementName] = {}; this.elementsStore[elementName]['elementId'] = findElementIdValue(item)
    }
    this.initStep(step)

    return this
  }

  click(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.elementClick({sessionId, elementId})
    }
    this.initStep(step)

    return this
  }

  mouseDown(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.mouseDown({sessionId, elementId})
    }
    this.initStep(step)

    return this
  }

  clear(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.elementClear({sessionId, elementId})
    }
    this.initStep(step)
    return this
  }

  mouseUp(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.mouseUp({sessionId, elementId})
    }
    this.initStep(step)

    return this
  }

  sendKeys(elementName, value) {
    const step = async () => {
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
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.elementSendKeys({sessionId, elementId, text, value})
    }
    this.initStep(step)

    return this
  }

  getText(elementName, asserter) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      const {value} = await this.elementText({sessionId, elementId})
      this.elementsStore[elementName]['text'] = value
      if(asserter) {asserter(value)}
    }
    this.initStep(step)
    return this
  }

  back() {
    const step = async () => {
      const {sessionId} = this; await this.navigateBack({sessionId})
    }
    this.initStep(step)
    return this
  }

  forward() {
    const step = async () => {
      const {sessionId} = this; await this.navigateForward({sessionId})
    }
    this.initStep(step)
    return this
  }

  refresh() {
    const step = async () => {
      const {sessionId} = this; await this.refresh({sessionId})
    }
    this.initStep(step)
    return this
  }

  url(asserter) {
    const step = async () => {
      const {sessionId} = this;
      const {value} = await this.windowUrl({sessionId})
      this.url = value
      if(asserter) {asserter(value)}
    }
    this.initStep(step)

    return this
  }

  title(asserter) {
    const step = async () => {
      const {sessionId} = this;
      const {value} = await this.windowTitle({sessionId})
      this.title = value
      if(asserter) {asserter(value)}
    }
    this.initStep(step)
    return this
  }

  visible(elementName, asserter) {
    const step = async () => {
      // visible is not current here
      const {sessionId} = this;
      const {value} = await this.windowTitle({sessionId})
      this.title = value
      if(asserter) {asserter(value)}
    }
    this.initStep(step)
    return this
  }

  startWorkflow(workflowName) {
    this.currentWorkflow = workflowName
    return this
  }

  wait(time, pollInterval = 200) {
    return {
      elementVisible: (elementName, cssSelector) => {
        const step = async () => {

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
        }
        this.initStep(step)
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
    const step = async () => {
      const {sessionId} = this
      await this.openUrl({sessionId, url})
    }
    this.initStep(step)
    return this
  }

  saveWorkflow(workflowName) {
    this.currentWorkflow = null
    return this
  }

  cleanState() {
    this.queue = []
    this.elementsStore = {}
    return this
  }

  initWorkflow(workflowName) {
    this.queue.push(...this.workflows[workflowName])
    return this
  }

  async exec() {
    for(const item of this.queue) {
      await item()
    }
    this.queue = []
  }
}

module.exports = {
  Client
}