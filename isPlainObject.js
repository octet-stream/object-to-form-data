const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

// Based ob lodash/isPlainObject
function isPlainObject(val) {
  if (Object.prototype.toString.call(val).slice(8, -1) !== "Object") {
    return false
  }

  const proto = getPrototype(val)

  if (proto === null || proto === undefined) {
    return true
  }

  return proto.constructor && proto.constructor.toString() === objectCtorString
}

module.exports = isPlainObject
