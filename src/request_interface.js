const fetch = require('node-fetch')

const headersDefault = {'Content-Type': 'application/json'}

async function _fetchy(method, {slowTime = 0, timeout, url, body = undefined, headers = headersDefault}) {

  // if method GET body should be undefined
  body = typeof body === 'object' ? JSON.stringify(body) : body
  // slowTime, if pause required before every request, default is 0
  if(slowTime) {await (() => new Promise(res => setTimeout(res, slowTime)))()}

  const response = await fetch(url, {
    method,
    headers,
    timeout,
    body
  })

  const contentType = response.headers.get("content-type")
  if(contentType && contentType.includes("application/json")) {
    const body = await response.json()
    if(response.status > 300) {throw new Error('Initial test')}
    return body
  } else {
    if(response.status > 300) {throw new Error('Initial test')}
    return body
  }
}

const fetchy = {
  post: _fetchy.bind(_fetchy, 'POST'),
  get: _fetchy.bind(_fetchy, 'GET'),
  put: _fetchy.bind(_fetchy, 'PUT'),
  delete: _fetchy.bind(_fetchy, 'DELETE')
}

module.exports = {
  fetchy
}
