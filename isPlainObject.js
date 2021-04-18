const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

/**
 * @param {unknown} value
 *
 * @return {value is Object.<string, any>}
 */
function isPlainObject(value) {
  if (Object.prototype.toString.call(value).slice(8, -1) !== "Object") {
    return false
  }

  const proto = getPrototype(value)

  if (proto == null) {
    return true
  }

  return proto.constructor && proto.constructor.toString() === objectCtorString
}

module.exports = isPlainObject
