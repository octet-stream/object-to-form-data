import test from "ava"

import type {Path} from "./pathToString.js"
import {createIterator} from "./createIterator.js"

interface TestParams {
  input: unknown[] | Record<string, unknown>
  expected: Array<[Path, unknown]>
  strict?: boolean
}

const withCreateIteratorTest = test.macro((t, params: TestParams) => {
  const actual = Array.from(createIterator(params.input, params.strict))

  t.deepEqual(actual, params.expected)
})

test("Iterates flat object", withCreateIteratorTest, {
  input: {
    name: "John Doe",
    email: "john.doe@example.com"
  },
  expected: [
    [["name"], "John Doe"],
    [["email"], "john.doe@example.com"]
  ]
})

test("Iterated through flat array", withCreateIteratorTest, {
  input: ["one", "two", "three"],
  expected: [
    [[0], "one"],
    [[1], "two"],
    [[2], "three"]
  ]
})

test("Iterates through nested object", withCreateIteratorTest, {
  input: {
    some: {
      nested: {
        key: "some value"
      }
    },
    another: {
      deep: {
        key: "some other value"
      }
    }
  },
  expected: [
    [["some", "nested", "key"], "some value"],
    [["another", "deep", "key"], "some other value"]
  ]
})

test("Iterates through collection", withCreateIteratorTest, {
  input: [
    {
      name: "John Doe",
      skills: ["JavaScript", "TypeScript", "React", "Qwik"],
      isHireable: true
    },
    {
      name: "Max Doe",
      skills: ["Python", "Django", "Flask", "MySQL", "Pony ORM"],
      isHireable: false
    }
  ],
  expected: [
    [[0, "name"], "John Doe"],
    [[0, "skills", 0], "JavaScript"],
    [[0, "skills", 1], "TypeScript"],
    [[0, "skills", 2], "React"],
    [[0, "skills", 3], "Qwik"],
    [[0, "isHireable"], true],
    [[1, "name"], "Max Doe"],
    [[1, "skills", 0], "Python"],
    [[1, "skills", 1], "Django"],
    [[1, "skills", 2], "Flask"],
    [[1, "skills", 3], "MySQL"],
    [[1, "skills", 4], "Pony ORM"],
    [[1, "isHireable"], false]
  ]
})

test(
  "Skips object keys for false values in strict mode",

  withCreateIteratorTest,

  {
    strict: true,
    input: {
      name: "Max Doe",
      skills: ["Python", "Django", "Flask", "MySQL", "Pony ORM"],
      isHireable: false
    },
    expected: [
      [["name"], "Max Doe"],
      [["skills", 0], "Python"],
      [["skills", 1], "Django"],
      [["skills", 2], "Flask"],
      [["skills", 3], "MySQL"],
      [["skills", 4], "Pony ORM"]
    ]
  }
)

test("Keeps false array values in strct mode", withCreateIteratorTest, {
  strict: true,
  input: ["some string", false, true, 42],
  expected: [
    [[0], "some string"],
    [[1], false],
    [[2], true],
    [[3], 42]
  ]
})
