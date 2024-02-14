import test from "ava"

import {pathToString} from "./pathToString.js"
import type {Path, PathNotations} from "./pathToString.js"

interface TestParams {
  input: Path
  expected: string
  notation?: PathNotations
}

const withPathToStringTest = test.macro((t, params: TestParams) => {
  const actual = pathToString(params.input, params.notation)

  t.is(actual, params.expected)
})

test("Returns path w/ signle element as string", withPathToStringTest, {
  input: ["top"],
  expected: "top"
})

test(
  "Wraps signle numeric element with square brackets",

  withPathToStringTest,

  {
    input: [0],
    expected: "[0]"
  }
)

test("Using bracked notation by default", withPathToStringTest, {
  input: ["top", "nested"],
  expected: "top[nested]"
})

test("Serializing number keys with bracket notation", withPathToStringTest, {
  input: ["top", 0, "nested"],
  expected: "top[0][nested]"
})

test("Using dot notation taken as the 2nd argument", withPathToStringTest, {
  input: ["top", "nested"],
  expected: "top.nested",
  notation: "dot"
})

test("Serializing number keys with dot notation", withPathToStringTest, {
  input: ["top", 0, "nested"],
  expected: "top.0.nested",
  notation: "dot"
})
