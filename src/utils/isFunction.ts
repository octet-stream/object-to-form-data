type Callable = (...any: any[]) => any

export const isFunction = (
  value: unknown
): value is Callable => typeof value === "function"
