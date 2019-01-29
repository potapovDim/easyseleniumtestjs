
/**
* @param {any} arg any argument
* @returns {string}
*/
const returnStringType = (arg) => Object.prototype.toString.call(arg)

/**
* @param {any} arg any argument
* @returns {boolean}
*/
const assertArray = (arg) => returnStringType(arg) === '[object Array]'

/**
* @param {any} arg any argument
* @returns {boolean}
*/
const assertString = (arg) => returnStringType(arg) === '[object String]'

/**
* @param {any} arg any argument
* @returns {boolean}
*/
const assertNumber = (arg) => returnStringType(arg) === '[object Number]'

/**
* @param {any} arg any argument
* @returns {boolean}
*/
const assertFunction = (arg) => returnStringType(arg) === '[object Function]'


module.exports = {
  assertArray,
  assertString,
  assertNumber,
  assertFunction
}
