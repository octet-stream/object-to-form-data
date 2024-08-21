export type PathEntry = string | number

export type Path = PathEntry[]

export type PathNotations = "dot" | "bracket"

/**
 * Serialized path using dot notation
 *
 * @param path A path to serialize
 *
 * @internal
 */
const toDotNotation = (path: Path): string => path.join(".")

/**
 * Serializes path using bracket notation
 *
 * @param path
 *
 * @internal
 */
function toBracketNotation(path: Path): string {
  const [first, ...rest] = path

  // This will likely be unreachable, yet we check if the array is empty
  /* c8 ignore next 3 */
  if (first == null) {
    throw new Error("Path cannot be empty")
  }

  const top = typeof first === "number" ? `[${first}]` : `${first}`

  // If path array has the only element, then just return it
  if (rest.length < 1) {
    return top
  }

  return rest.reduce<string>((prev, next) => `${prev}[${next}]`, top)
}

/**
 * Serializes given `path` array using spicified notation.
 *
 * @param path - An array representing a field's path within the array, object, or collection.
 * @param notation - Type of the nested fields notation. Can be either `"dot"` or `"bracket"`. Defaults to `"bracket"`
 *
 * @internal
 */
export function pathToString(
  path: Path,
  notation: PathNotations = "bracket"
): string {
  const serializer = notation === "dot" ? toDotNotation : toBracketNotation

  return serializer(path)
}
