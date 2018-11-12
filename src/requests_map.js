const URL = require('url')
const {endpoins} = require('./endpoints_map')
const {fetchy} = require('./request_interface')

const resolveUrl = (baseUrl, endpointUrl) => URL.resolve(baseUrl, endpointUrl)

const requestsMap = (seleniumUrl) => {
  const requests = {
    aceptAlert: (sessionId) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.acceptAllert(sessionId))})
    },
    dismissAlert: (sessionId) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.dismissAllert(sessionId))})
    },
    getValueAlert: (sessionId) => {
      return fetchy.get({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId))})
    },
    setValueAlert: (sessionId, text) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.textAlert(sessionId)), body: {text}})
    },
    navigateBack: (sessionId) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.back(sessionId))})
    },
    click: (sessionId) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.click(sessionId)), body: {button: 0}})
    },
    closeCurrentWindow: (sessionId) => {
      return fetchy.post({url: resolveUrl(seleniumUrl, endpoins.window(sessionId))})
    }
  }
}