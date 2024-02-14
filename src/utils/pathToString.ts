export type PathEntry = string | number

export type Path = PathEntry[]

export type PathNotations = "dot" | "bracket"

const toDotNotation = (path: Path): string => path.join(".")

function toBracketNotation(path: Path): string {
  const [first, ...rest] = path

  // This will likely be unreachable, yet we check if the array is empty
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

export function pathToString(
  path: Path,
  notation: PathNotations = "bracket"
): string {
  const serializer = notation === "dot" ? toDotNotation : toBracketNotation

  return serializer(path)
}
