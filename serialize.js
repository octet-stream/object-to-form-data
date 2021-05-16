const isPlainObject = require("./isPlainObject")
const FormData = require("./form-data")

const {keys} = Object
const {isArray} = Array

/**
 * @param {unknown} value
 *
 * @return {value is Function}
 */
const isFunction = value => typeof value === "function"

/**
 * @param {unknown} value
 *
 * @return {value is boolean}
 */
const isBoolean = value => typeof value === "boolean"

/**
 * @typedef {Object} Options
 *
 * @prop {boolean} strict
 */

/** @type {Options} */
const defaults = {
  strict: false
}

/**
 * Transform given object/collection to form-data
 *
 * @param {Object.<string, any> | any[]} object An object to transform
 * @param {Options | boolean} [options = null] Serialize options
 *
 * @return {FormData}
 */
function serialize(iterable, options = {}) {
  if (!(isArray(iterable) || isPlainObject(iterable))) {
    throw new TypeError("Expected object or array as the first argument.")
  }

  if (isBoolean(options)) {
    options = {strict: options}
  }

  if (!isPlainObject(options)) {
    throw new TypeError(
      "Expected the second argument to be an object or boolean."
    )
  }

  const {strict} = {...defaults, ...options}

  // Choose the serialization method for browsers which
  // are support FormData API partially
  // See: https://caniuse.com/#search=formdata
  const method = isFunction(FormData.prototype.set) ? "set" : "append"

  const fd = new FormData()

  /**
   * Set object fields to FormData instance
   *
   * @param {Object.<string, unknown> | unknown[]} value A value of the current field
   * @param {string} [prefix = undefined] Parent field key
   *
   * @api private
   */
  function set(value, prefix = undefined) {
    for (const key of keys(value)) {
      const name = prefix ? `${prefix}[${key}]` : key
      const field = value[key]

      if (isArray(field) || isPlainObject(field)) {
        set(field, name)
      } else {
        if (strict && (isBoolean(field) && field === false)) {
          continue
        }

        fd[method](name, field)
      }
    }
  }

  set(iterable)

  return fd
}

/**
 * @param {Object.<string, any> | any[]} iterable
 *
 * @return {FormData}
 */
const strict = iterable => serialize(iterable, {strict: true})

module.exports = serialize
module.exports.default = serialize
module.exports.strict = strict
