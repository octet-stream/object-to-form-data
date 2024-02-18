type Callable = (...any: any[]) => any

/**
 * Checks if the `value` is a function
 *
 * @param value - A value to test
 *
 * @internal
 */
export const isFunction = (
  value: unknown
): value is Callable => typeof value === "function"
