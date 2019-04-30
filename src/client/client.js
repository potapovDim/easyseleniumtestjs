const {buildSeleniumAPI} = require('./requests_map')
const {findSessionIdValue, findElementIdValue} = require('./util')
const {assertNumber, assertArray, assertFunction, assertString} = require('./is_type')


const sleep = (ms) => new Promise(_ => setTimeout(() => _(true), ms))

class Client {
  constructor(config) {
    const {seleniumUrl, browser} = config

    this.requests = buildSeleniumAPI(seleniumUrl)

    this.capabilities = browser
    this.queue = []
    this.sessionId = null
    this.elementsStore = {}
    this.workflows = {}
    this.currentWorkflow
  }

  _initStep(step) {
    if(this.currentWorkflow) {
      if(!this.workflows[this.currentWorkflow]) {this.workflows[this.currentWorkflow] = []}
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
      const item = await this.requests.createSession({capabilities: this.capabilities})
      this.sessionId = findSessionIdValue(item)
    }
    this._initStep(step)
    return this
  }

  end() {
    const step = async () => {
      const {sessionId} = this; await this.requests.closeSession({sessionId})
    }
    this._initStep(step)
    return this
  }

  sleep(time = 5000) {
    const step = async () => sleep(time)
    this._initStep(step)
    return this
  }

  element(elementName, cssSelector) {
    const step = async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const item = await this.requests.getElement({sessionId, selectorObj: css})
      this.elementsStore[elementName] = {}; this.elementsStore[elementName]['elementId'] = findElementIdValue(item)
    }
    this._initStep(step)

    return this
  }

  elementByText(elementName, selector, text) {
    const step = async () => {
      const script = `
        function getElementByText() {
          const elements = document.querySelectorAll('${selector}')
          for(var i = 0; i< elements.length;i++) {
            var currentElement = elements[i]
            var text = currentElement.innerText ? currentElement.innerText : currentElement.textContent
            if(text === '${text}') {return currentElement}
          }
          throw new Error('Element was not found, selector: "${selector}", text: "${text}"')
        }
      `
      const {sessionId} = this
      const item = await this.requests.executeScript({sessionId, selectorObj: css})
      this.elementsStore[elementName] = {}; this.elementsStore[elementName]['elementId'] = findElementIdValue(item)
    }
    this._initStep(step)

    return this
  }

  elements(elementsName, cssSelector) {
    const step = async () => {
      const _that = this
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const {value} = await this.requests.getElements({sessionId, selectorObj: css})
      this.elementsStore[elementsName] = []
      value.forEach(function(item) {
        _that.elementsStore[elementsName].push({elementId: findElementIdValue(item)})
      })
    }
    this._initStep(step)
    return this
  }

  click(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementClick({sessionId, elementId})
    }
    this._initStep(step)

    return this
  }

  clickElements(elementsName, index = 0) {
    if(!elementsName) {
      throw new Error('elementsName is required')
    }
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementsName][index]
      await this.requests.elementClick({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  mouseDown(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.mouseDown({sessionId, elementId})
    }
    this._initStep(step)

    return this
  }

  clear(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementClear({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  mouseUp(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.mouseUp({sessionId, elementId})
    }
    this._initStep(step)

    return this
  }

  /**
   *
   * @param {string} elementName
   * @param {string} value, default is ''
   */
  sendKeys(elementName, value = '') {
    if(!elementName) {
      throw new Error('elementName is required')
    }
    const step = async () => {
      let text = ''
      if(assertNumber(value)) {
        value = value.toString().split('')
      } else if(!assertArray(value)) {
        value = value.split('')
      } else {
        value = value
      }
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementSendKeys({sessionId, elementId, text, value})
    }
    this._initStep(step)

    return this
  }

  getText(elementName, asserter) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      const {value} = await this.requests.elementText({sessionId, elementId})
      this.elementsStore[elementName]['text'] = value
      if(asserter) {asserter(value)}
    }
    this._initStep(step)
    return this
  }

  back() {
    const step = async () => {
      const {sessionId} = this; await this.requests.navigateBack({sessionId})
    }
    this._initStep(step)
    return this
  }

  forward() {
    const step = async () => {
      const {sessionId} = this; await this.requests.navigateForward({sessionId})
    }
    this._initStep(step)
    return this
  }

  refresh() {
    const step = async () => {
      const {sessionId} = this; await this.requests.refresh({sessionId})
    }
    this._initStep(step)
    return this
  }

  url(asserter) {
    const step = async () => {
      const {sessionId} = this;
      const {value} = await this.requests.windowUrl({sessionId})
      this.url = value
      if(asserter) {asserter(value)}
    }
    this._initStep(step)

    return this
  }

  title(asserter) {
    const step = async () => {
      const {sessionId} = this;
      const {value} = await this.requests.windowTitle({sessionId})
      this.title = value
      if(asserter) {asserter(value)}
    }
    this._initStep(step)
    return this
  }

  visible(elementName, asserter) {
    const step = async () => {
      // visible is not current here
      const {sessionId} = this;
      const {value} = await this.requests.windowTitle({sessionId})
      this.title = value
      if(asserter) {asserter(value)}
    }
    this._initStep(step)
    return this
  }

  startWorkflow(workflowName) {
    this.currentWorkflow = workflowName
    return this
  }

  removeWorkflow() {

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
              const elementId = findElementIdValue(await this.requests.getElement({sessionId, selectorObj: css}), '', false)
              if(elementId) {this.elementsStore[elementName] = {}; this.elementsStore[elementName].elementId = elementId}
              element = this.elementsStore[elementName]
            } while((await sleep(pollInterval)) && !element && +Date.now() - now < time)
            time = +Date.now() - now
          }
          const {elementId} = this.elementsStore[elementName]
          do {
            isVisible = await this.requests.elementDisplayed({sessionId, elementId})
          } while((await sleep(pollInterval)) && !isVisible && +Date.now() - now < time)
        }
        this._initStep(step)
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
      await this.requests.openUrl({sessionId, url})
    }
    this._initStep(step)
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

  aceptAlert() {
    const step = async () => {
      const {sessionId} = this; await this.requests.aceptAlert({sessionId})
    }
    this._initStep(step)
    return this
  }

  setTextAlert() {
    const step = async () => {
      const {sessionId} = this; await this.requests.setTextAlert({sessionId})
    }
    this._initStep(step)
    return this
  }

  getTextAlert() {
    const step = async () => {
      const {sessionId} = this; await this.requests.getTextAlert({sessionId})
    }
    this._initStep(step)
    return this
  }

  dismissAlert() {
    const step = async () => {
      const {sessionId} = this; await this.requests.dismissAlert({sessionId})
    }
    this._initStep(step)
    return this
  }

  windowCloseCurrent() {
    const step = async () => {
      const {sessionId} = this; await this.requests.windowCloseCurrent({sessionId})
    }
    this._initStep(step)
    return this
  }

  windowSize() {
    const step = async () => {
      const {sessionId} = this; await this.requests.windowSize({sessionId})
    }
    this._initStep(step)
    return this
  }

  allWindowHandles() {
    const step = async () => {
      const {sessionId} = this; await this.requests.windowHandles({sessionId})
    }
    this._initStep(step)
    return this
  }

  windowHandle() {
    const step = async () => {
      const {sessionId} = this; await this.requests.windowHandle({sessionId})
    }
    this._initStep(step)
    return this
  }

  screenshot() {
    const step = async () => {
      const {sessionId} = this; await this.requests.screenshot({sessionId})
    }
    this._initStep(step)
    return this
  }

  openWindow(windowIndex) {
    const step = async () => {
      const {sessionId} = this
      const windows = await this.requests.windowHandles({sessionId})
      const nameHandle = windows.value[windowIndex]
      await this.requests.openWindow({sessionId, nameHandle})
    }
    this._initStep(step)
    return this
  }

  mouseClick() {
    const step = async () => {
      const {sessionId} = this; await this.requests.mouseClick({sessionId})
    }
    this._initStep(step)
    return this
  }

  getTagName(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementTagName({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  submit(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.submit({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  doubleClick(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementDblClick({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  isDisplayed(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementDisplayed({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  isEnabled(elementName) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.elementEnabled({sessionId, elementId})
    }
    this._initStep(step)
    return this
  }

  getChildElement(elementName, cssSelector) {
    const step = async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      const item = await this.requests.getElementChild({sessionId, elementId, selectorObj: css})
      this.elementsStore[elementName] = {}; this.elementsStore[elementName]['elementId'] = findElementIdValue(item)
    }
    this._initStep(step)
    return this
  }

  getChildrenElements(cssSelector) {
    const step = async () => {
      const css = {using: 'css selector', value: cssSelector}
      const {sessionId} = this
      await this.requests.getElementChildren({sessionId, elementId, selectorObj: css})
    }
    this._initStep(step)
    return this
  }

  getAttribute(elementName, attribute) {
    const step = async () => {
      const {sessionId} = this
      const {elementId} = this.elementsStore[elementName]
      await this.requests.getElementAttribute({sessionId, elementId, attribute})
    }
    this._initStep(step)
    return this
  }

  executeScript(script, args) {
    const step = async () => {
      const {sessionId} = this
      await this.requests.executeScript({sessionId, script, ...args})
    }
    this._initStep(step)
    return this
  }

  executeScriptAsync(script, args) {
    const step = async () => {
      const {sessionId} = this
      await this.requests.executeScriptAsync({sessionId, script, ...args})
    }
    this._initStep(step)
    return this
  }

  pressKey(key) {
    const step = async () => {
      const {sessionId} = this
      await this.requests.pressKey({sessionId, key})
    }
    this._initStep(step)
    return this
  }

  switchToFrame(id) {
    const step = async () => {
      const {sessionId} = this
      await this.requests.frame({sessionId, id})
    }
    this._initStep(step)
    return this
  }

  switchToFrameParent() {
    const step = async () => {
      const {sessionId} = this
      await this.requests.frameParent({sessionId})
    }
    this._initStep(step)
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