const FormData = require("isomorphic-form-data")
const isPlainObject = require("lodash.isplainobject")

const isArray = Array.isArray
const keys = Object.keys

/**
 * Transform given object/collection to form-data
 *
 * @param {object} object – An object to transform
 * @param {string} [root = null] – A root key for fieldname
 *
 * @return {FormData} instance
 */
function serialize(object, root = null) {
  const fd = new FormData()

  /**
   * Append object fields to FormData instance
   *
   * @param {string} [name = undefined] – parent field key
   * @param {any} value – A value of the current field
   *
   * @api private
   */
  function append(name, value) {
    for (const key of keys(value)) {
      const fieldname = name ? `${name}[${key}]` : key
      const field = value[key]

      if (isArray(field) || isPlainObject(field)) {
        append(fieldname, field)
      } else {
        fd.append(fieldname, field)
      }
    }
  }

  append(root, object)

  return fd
}

module.exports = serialize
module.exports.default = serialize
