const elementW3CElementID = 'element-6066-11e4-a52e-4f735466cecf'

const elementW3CObject = (elementId) => ({ELEMENT: elementId, [elementW3CElementID]: elementId})

function findSessionIdValue(responseObj, currentId = '') {
  const keys = Object.keys(responseObj)

  const sessionId = keys.reduce((acc, key) => {
    if(key === 'sessionId') {
      acc = responseObj[key]
    } else if(typeof responseObj[key] === 'object') {
      acc = findSessionIdValue(responseObj[key], acc)
    }
    return acc
  }, currentId)
  if(sessionId.length) {
    return sessionId
  }
  throw new Error('Session id was not found')
}

function findElementIdValue(responseObj, currentId = '') {
  const keys = Object.keys(responseObj)

  const sessionId = keys.reduce((acc, key) => {
    if(key === elementW3CElementID || key === 'ELEMENT') {
      acc = responseObj[key]
    } else if(typeof responseObj[key] === 'object') {
      acc = findElementIdValue(responseObj[key], acc)
    }
    return acc
  }, currentId)
  if(sessionId.length) {
    return sessionId
  }
  throw new Error('Element id was not found')
}

module.exports = {
  elementW3CObject,
  findSessionIdValue,
  findElementIdValue
}
