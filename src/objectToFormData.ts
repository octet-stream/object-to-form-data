import {createIterator} from "./utils/createIterator.js"
import {isPlainObject} from "./utils/isPlainObject.js"
import {pathToString} from "./utils/pathToString.js"
import {isFunction} from "./utils/isFunction.js"
import type {Input} from "./Input.js"

export interface ObjectToFormDataOptions {
  /**
   * Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values
   *
   * @example
   *
   * ```js
   * import {objectToFormData} from "object-to-form-data"
   *
   * const input = {
   *   name: "Max Doe",
   *   email: "max.doe@example.com",
   *   isHireable: false
   * }
   *
   * const form = objectToFormData(input, {strict: true})
   *
   * console.log([...form])
   * // -> [["name", "Max Doe"], ["email", "max.doe@example.com"]]
   * ```
   */
  strict?: boolean

  /**
   * Custom spec-compliant [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) implementation
   *
   * @example
   *
   * ```js
   * import {objectToFormData} from "object-to-form-data"
   * import {FormData} from "formdata-node"
   *
   * const input = {
   *   name: "John Doe",
   *   email: "john.doe@example.com",
   *   isHireable: true
   * }
   *
   * const form = objectToFormData(input, {FormData})
   *
   * console.log(form.constructor === FormData) // -> true
   * ```
   */
  FormData?: typeof FormData
}

export interface ObjectToFormData {
  /**
   * Transform given object, array, or collection to FormData object
   *
   * @param input An object to transform
   */
  (input: Input): FormData

  /**
   * Transform given object, array, or collection to FormData object
   *
   * @param input - An object to transform
   * @param strict - Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values.
   */
  (input: Input, strict?: boolean): FormData

  /**
   * Transform given object, array, or collection to FormData object
   *
   * @param input An object to transform
   */
  (input: Input, options?: ObjectToFormDataOptions): FormData

  /**
   * Transform given object, array, or collection to FormData object.
   *
   * **This method always enables `strict` option.**
   *
   * @deprecated Use `objectToFormData` with `strict` option
   */
  strict(input: Input): FormData
}

const defaults: Required<ObjectToFormDataOptions> = {
  strict: false,
  FormData // FIXME: Figure out why the types are incompatible
}

export const objectToFormData: ObjectToFormData = (
  input: Input,
  optionsOrStrict?: ObjectToFormDataOptions | boolean
): FormData => {
  if (!(Array.isArray(input) || isPlainObject(input))) {
    throw new TypeError("Expected object or array as the first argument.")
  }

  if (
    optionsOrStrict && !(
      isPlainObject(optionsOrStrict) || typeof optionsOrStrict === "boolean"
    )
  ) {
    throw new TypeError(
      "Expected the second argument to be an object or boolean."
    )
  }

  const {
    strict,
    FormData: CustomFormData
  }: Required<ObjectToFormDataOptions> = typeof optionsOrStrict === "boolean"
    ? {...defaults, strict: optionsOrStrict}
    : {...defaults, ...optionsOrStrict}

  const form = new CustomFormData()

  // Choose the serialization method for browsers which
  // are support FormData API partially
  // See: https://caniuse.com/#search=formdata
  const method: "set" | "append" = isFunction(CustomFormData.prototype.set)
    ? "set"
    : "append"

  for (const [path, value] of createIterator(input, strict)) {
    form[method](pathToString(path), value as Blob | string) // Cast value type because FormData will normalize it anyway
  }

  return form
}

/* c8 ignore next 3 */
objectToFormData.strict = (input: Input) => objectToFormData(input, {
  strict: true
})
