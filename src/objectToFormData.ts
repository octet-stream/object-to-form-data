import {pathToString, Path, type PathNotations} from "./utils/pathToString.js"
import {createIterator} from "./utils/createIterator.js"
import {isPlainObject} from "./utils/isPlainObject.js"
import {isFunction} from "./utils/isFunction.js"
import type {Input} from "./Input.js"

/**
 * Value normalizer.
 *
 * This function will be called on each *scalar* value, before it's added to FormData instanceю
 *
 * @param value - current entry value
 * @param name - name of the entry
 * @param path - entry's path within original object
 */
export type NormalizeValue = (
  value: unknown,
  name: string,
  path: Path
) => string | Blob

const noopNormalizeValue: NormalizeValue = value => value as string | Blob

export interface ObjectToFormDataOptions {
  /**
   * Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values
   *
   * @default false
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
   * @default globalThis.FormData
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

  /**
   * Type of the path notation. Can be either `"dot"` or `"bracket"`
   *
   * @default "bracket"
   */
  notation?: PathNotations

  /**
   * Value normalizer.
   *
   * This function will be called on each *scalar* value, before it's added to FormData instanceю
   */
  normalizeValue?: NormalizeValue
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
    notation,
    strict = false,
    FormData: CustomFormData = FormData,
    normalizeValue = noopNormalizeValue
  }: ObjectToFormDataOptions = typeof optionsOrStrict === "boolean"
    ? {strict: optionsOrStrict}
    : {...optionsOrStrict}

  const form = new CustomFormData()

  // Choose the serialization method for browsers which
  // are support FormData API partially
  // See: https://caniuse.com/#search=formdata
  const method: "set" | "append" = isFunction(CustomFormData.prototype.set)
    ? "set"
    : "append"

  for (const [path, raw] of createIterator(input, strict)) {
    const name = pathToString(path, notation)
    const value = normalizeValue(raw, name, path)

    form[method](name, value) // Cast value type because FormData will normalize it anyway
  }

  return form
}

/* c8 ignore next 3 */
objectToFormData.strict = (input: Input) => objectToFormData(input, {
  strict: true
})
