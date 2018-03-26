const FormData = require("./form-data")
const isPlainObject = require("lodash.isplainobject")

const isArray = Array.isArray
const keys = Object.keys

const isFunction = value => typeof value === "function"

/**
 * Transform given object/collection to form-data
 *
 * @param {object | array} object – An object to transform
 * @param {string} [root = null] – Root key of a fieldname
 *
 * @return {FormData} instance
 */
function serialize(iterable, root = null) {
  if (!(isArray(iterable) || isPlainObject(iterable))) {
    throw new TypeError("Expected object or array as the first argument.")
  }

  // Choose the serialization method for browsers which
  // are support FormData API partially
  // See: https://caniuse.com/#search=formdata
  const method = isFunction(FormData.prototype.set) ? "set" : "append"

  const data = new FormData()

  /**
   * Set object fields to FormData instance
   *
   * @param {string} [prefix = undefined] – parent field key
   * @param {any} value – A value of the current field
   *
   * @api private
   */
  function set(prefix, value) {
    for (const key of keys(value)) {
      const name = prefix ? `${prefix}[${key}]` : key
      const field = value[key]

      if (isArray(field) || isPlainObject(field)) {
        set(name, field)
      } else if(typeof field === 'boolean') {
          if(field) data[method](name, field)
      } else {
        data[method](name, field)
      }
    }
  }

  set(root, iterable)

  return data
}

module.exports = serialize
module.exports.default = serialize
