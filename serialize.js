const FormData = require("./form-data")
const isPlainObject = require("lodash.isplainobject")

const isArray = Array.isArray
const assign = Object.assign
const keys = Object.keys

const isFunction = value => typeof value === "function"

const isBoolean = value => typeof value === "boolean"

const isString = value => typeof value === "string"

const defaults = {
  strict: false,
  root: null
}

/**
 * Transform given object/collection to form-data
 *
 * @param {object | array} object – An object to transform
 * @param {string} [root = null] – Root key of a fieldname
 *
 * @return {FormData} instance
 */
function serialize(iterable, options = {}) {
  if (!(isArray(iterable) || isPlainObject(iterable))) {
    throw new TypeError("Expected object or array as the first argument.")
  }

  if (isBoolean(options)) {
    options = {strict: options}
  } else if (isString(options) && options) {
    options = {root: options}
  }

  if (!isPlainObject(options)) {
    throw new TypeError(
      "The second argument can be an object, boolean or string value."
    )
  }

  options = assign({}, defaults, options)

  // Choose the serialization method for browsers which
  // are support FormData API partially
  // See: https://caniuse.com/#search=formdata
  const method = isFunction(FormData.prototype.set) ? "set" : "append"

  const fd = new FormData()

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
      } else {
        if ((options.strict && (isBoolean(field) && field === false))) {
          continue
        }

        fd[method](name, field)
      }
    }
  }

  set(options.root, iterable)

  return fd
}

const strict = (iterable, root) => serialize(iterable, {root, strict: true})

module.exports = serialize
module.exports.default = serialize
module.exports.strict = strict
