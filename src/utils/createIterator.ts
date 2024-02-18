import type {Path, PathEntry} from "./pathToString.js"
import {isPlainObject} from "./isPlainObject.js"
import type {Input} from "../Input.js"

type Entry = [PathEntry, unknown]

/**
 * Creates iterator allowing to iterate over the `input` entries.
 *
 * @param input - Iterable object, either POJO or Array
 *
 * @internal
 */
function* createEntriesIterator(
  input: Input
): Generator<Entry, void, undefined> {
  let entries: Entry[] | Iterable<Entry> | IterableIterator<Entry>

  if (Array.isArray(input)) {
    entries = input.entries()
  } else {
    entries = Object.entries(input)
  }

  yield* entries
}

/**
 * Creates recursive iterator allowing to walk through the object's nested fields.
 *
 * The recursion termitates once any unsupported object, or scalar type is reached.
 *
 * @param input - Iterable object, either POJO or Array
 * @param path - Path to current level field from the top of the `input`
 * @param strict - Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values
 *
 * @internal
 */
function* createRecursiveIterator(
  input: Input,
  path: Path,
  strict: boolean
): Generator<[Path, unknown], void, undefined> {
  for (const [key, value] of createEntriesIterator(input)) {
    const nextPath = [...path, key]
    if (Array.isArray(value) || isPlainObject(value)) {
      yield* createRecursiveIterator(value, nextPath, strict)
    } else if (strict === true && value === false && typeof key === "string") {
      // eslint-disable-next-line no-continue
      continue
    } else {
      yield [nextPath, value]
    }
  }
}

/**
 * Creates iterator allowing to recursively iterate over given `input` iverable object. The object must be either POJO or Array.
 *
 * @param input
 * @param strict
 *
 * @internal
 */
export const createIterator = (
  input: Input,
  strict = false
) => createRecursiveIterator(input, [], strict)
