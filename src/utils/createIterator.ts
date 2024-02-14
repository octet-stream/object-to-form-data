import type {Path, PathEntry} from "./pathToString.js"
import {isPlainObject} from "./isPlainObject.js"
import type {Input} from "../Input.js"

type Entry = [PathEntry, unknown]

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

function* createRecursiveIterator(
  input: Input,
  path: Path,
  strict: boolean
): Generator<[Path, unknown], void, undefined> {
  const entries = createEntriesIterator(input)

  for (const [key, value] of entries) {
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

export const createIterator = (
  input: Input,
  strict = false
) => createRecursiveIterator(input, [], strict)
