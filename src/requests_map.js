const URL = require('url')
const {endpoins} = require('./endpoints_map')
const {fetchy} = require('./request_interface')

const resolveUrl = (baseUrl, endpointUrl) => URL.resolve(baseUrl, endpointUrl)

const buildSeleniumAPI = (that, seleniumUrl) => {
  const requests = {
    createSession: ({capabilities}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.getSession()), body: capabilities})
    },
    closeSession: ({sessionId}) => {
      return fetchy.delete({url: resolveUrl(seleniumUrl, endpoins.killSession(sessionId))})
    },
    aceptAlert: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.acceptAlert(sessionId))})
    },
    setTextAlert: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId))})
    },
    getTextAlert: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId))})
    },
    navigateBack: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.back(sessionId))})
    },
    mouseDown: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.buttonDown(sessionId)), body: {element: {button: 0}}})
    },
    mouseUp: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.buttonUp(sessionId)), body: {element: {button: 0}}})
    },
    navigateForward: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.forward(sessionId))})
    },
    refresh: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.refresh(sessionId))})
    },
    dismissAlert: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.dismissAlert(sessionId))})
    },
    windowCloseCurrent: ({sessionId}) => {
      return fetchy.delete({url: resolveUrl(seleniumUrl, endpoins.window(sessionId))})
    },
    windowTitle: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.title(sessionId))})
    },
    windowUrl: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.url(sessionId))})
    },
    openUrl: ({sessionId, url}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.url(sessionId)), body: {url}})
    },
    windowSize: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.windowSize(sessionId))})
    },
    windowHandles: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.windowHandles(sessionId))})
    },
    windowHandle: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.windowHandle(sessionId))})
    },
    openWindow: ({sessionId, nameHandle}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.window(sessionId)), body: {name: nameHandle, handle: nameHandle}})
    },
    screenshot: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.screenshot(sessionId))})
    },
    mouseClick: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.click(sessionId)), body: {button: 0}})
    },
    elementClear: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.clear(sessionId, elementId))})
    },
    elementClick: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.clickElement(sessionId, elementId)), body: {button: 0}})
    },
    elementSendKeys: ({sessionId, elementId, text, value}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.sendKeys(sessionId, elementId)), body: {text, value}})
    },
    elementTagName: ({sessionId, elementId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.elementTag(sessionId, elementId))})
    },
    elementSubmit: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.submit(sessionId, elementId))})
    },
    elementDblClick: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.doubleclick(sessionId, elementId)), body: {button: 0}})
    },
    elementDisplayed: ({sessionId, elementId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.displayed(sessionId, elementId))})
    },
    elementEnabled: ({sessionId, elementId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.enabled(sessionId, elementId))})
    },
    elementText: ({sessionId, elementId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.text(sessionId, elementId))})
    },
    getElement: ({sessionId, selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.element(sessionId)), body: selectorObj})
    },
    getElements: ({sessionId: selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.elements(sessionId)), body: selectorObj})
    },
    getElementChild: ({sessionId, elementId, selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.elementFromElement(sessionId, elementId)), body: selectorObj})
    },
    getElementChildren: ({sessionId, elementId, selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.elementsFromElement(sessionId, elementId)), body: selectorObj})
    },
    getElementAttribute: ({sessionId, elementId, attribute}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.attribute(sessionId, elementId, attribute))})
    },
    executeScript: ({sessionId, script, args}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.executeSync(sessionId)), body: {script, args}})
    },
    executeScriptAsync: ({sessionId, script, args}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.executeAsync(sessionId)), body: {script, args}})
    },
    pressKey: ({sessionId, keys}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.pressKeys(sessionId)), body: {value: keys}})
    },
    frame: ({sessionId, id}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.frame(sessionId)), body: {id}})
    },
    frameParent: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.parentFrame(sessionId)), body: {id: null}})
    }
  }
  for(const key of Object.keys(requests)) {
    that[key] = requests[key]
  }
}

module.exports = {
  buildSeleniumAPI
}