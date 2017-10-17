const FormData = require("formdata-node").default
const isPlainObject = require("lodash.isplainobject")

const isArray = Array.isArray
const keys = Object.keys

/**
 * Transform given object/collection to form-data
 *
 * @param {object} object – An object to transform
 * @param {string} [root = null] – Root key of a fieldname
 *
 * @return {FormData} instance
 */
function serialize(object, root = null) {
  if (!(isArray(object) || isPlainObject(object))) {
    throw new TypeError("Expected object or array as the first argument.")
  }

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
      const fieldname = prefix ? `${prefix}[${key}]` : key
      const field = value[key]

      if (isArray(field) || isPlainObject(field)) {
        set(fieldname, field)
      } else {
        fd.set(fieldname, field)
      }
    }
  }

  set(root, object)

  return fd
}

module.exports = serialize
module.exports.default = serialize
