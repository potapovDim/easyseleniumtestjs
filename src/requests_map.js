const URL = require('url')
const {endpoins} = require('./endpoints_map')
const {fetchy} = require('./request_interface')

const resolveUrl = (baseUrl, endpointUrl) => URL.resolve(baseUrl, endpointUrl)

const requestsMap = (seleniumUrl) => {
  const requests = {
    aceptAlert: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.acceptAllert(sessionId))})
    },
    dismissAlert: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.dismissAllert(sessionId))})
    },
    getValueAlert: ({sessionId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId))})
    },
    setValueAlert: ({sessionId, text}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId)), body: {text}})
    },
    navigateBack: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.back(sessionId))})
    },
    closeCurrentWindow: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.window(sessionId))})
    },
    mouseClick: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.click(sessionId)), body: {button: 0}})
    },
    mouseDown: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.buttonDown(sessionId)), body: {element: {button: 0}}})
    },
    mouseUp: ({sessionId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.buttonUp(sessionId)), body: {element: {button: 0}}})
    },
    elementClear: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.clear(sessionId, elementId))})
    },
    elementClick: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.clickElement(sessionId, elementId)), body: {button: 0}})
    },
    elementDblClick: ({sessionId, elementId}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.doubleclick(sessionId, elementId)), body: {button: 0}})
    },
    elementDisplayed: ({sessionId, elementId}) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.displayed(sessionId, elementId))})
    },
    getElement: ({sessionId, selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.element(sessionId)), body: selectorObj})
    },
    getElements: ({sessionId: selectorObj}) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.elements(sessionId)), body: selectorObj})
    },
  }
}