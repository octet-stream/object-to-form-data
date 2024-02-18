/**
 * Check if the `value` is of type boolean
 *
 * @param value - A value to test
 *
 * @internal
 */
export const isBoolean = (
  value: unknown
): value is boolean => typeof value === "boolean"
