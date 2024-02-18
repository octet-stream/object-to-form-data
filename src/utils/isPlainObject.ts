const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

/**
 * Check if the `value` is a Plain JavaScript Object
 *
 * @param value - A value to check
 *
 * @internal
 */
export function isPlainObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  if (Object.prototype.toString.call(value).slice(8, -1) !== "Object") {
    return false
  }

  const proto = getPrototype(value)

  if (proto == null) {
    return true
  }

  return proto.constructor && proto.constructor.toString() === objectCtorString
}
