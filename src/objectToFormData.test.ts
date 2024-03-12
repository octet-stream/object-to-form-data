import test from "ava"

import {
  FormData as FormDataNode,
  File as FormDataFile,
  Blob as FormDataBlob
} from "formdata-node"
import {createSandbox} from "sinon"

import {objectToFormData} from "./objectToFormData.js"

interface TestParams {
  input: unknown[] | Record<string, unknown>
  expected: Array<[string | number, unknown]>
  serializer?: typeof objectToFormData
  strict?: boolean
}

const withSetializerTest = test.macro((t, params: TestParams) => {
  const {input, expected, strict, serializer = objectToFormData} = params

  const actual = Array.from(serializer(input, {strict}))

  t.deepEqual(actual, expected)
})

test.before(() => {
  if (typeof globalThis.FormData === "undefined") {
    globalThis.FormData = FormDataNode
  }

  if (typeof globalThis.File === "undefined") {
    globalThis.File = FormDataFile
  }

  if (typeof globalThis.Blob === "undefined") {
    globalThis.Blob = FormDataBlob
  }
})

test("Returns FormData", t => {
  const actual = objectToFormData({})

  t.true(actual instanceof FormData)
})

test("Accepts custom FormData", t => {
  const form = objectToFormData({}, {
    FormData: FormDataNode
  })

  t.is(form.constructor, FormDataNode)
})

test("Calls .append() method if FormData does not implement .set()", t => {
  const sandbox = createSandbox()

  const appendStub = sandbox.stub(FormDataNode.prototype, "append")

  sandbox.stub(FormDataNode.prototype, "set").get(() => undefined)

  objectToFormData({key: "value"}, {
    FormData: FormDataNode
  })

  t.true(appendStub.called)

  sandbox.restore()
})

test("Returns File as is", async t => {
  const file = new File(["Test file content"], "test.txt", {type: "text/plain"})

  const form = objectToFormData({file})

  const actual = form.get("file") as File

  t.true(actual instanceof File)
  t.is(await actual.text(), await file.text())
})

test("Returns Blob as is", async t => {
  const blob = new Blob(["Test file content"], {type: "text/plain"})

  const form = objectToFormData({blob})

  const actual = form.get("blob") as File

  t.true(actual instanceof File)
  t.is(await actual.text(), await blob.text())
})

test("Returns empty FormData for empty object", withSetializerTest, {
  input: {},
  expected: []
})

test("Returns empty FormData for empty array", withSetializerTest, {
  input: [],
  expected: []
})

test("Serializes flat object", withSetializerTest, {
  input: {
    name: "John Doe",
    isHireable: true
  },
  expected: [
    ["name", "John Doe"],
    ["isHireable", "true"]
  ]
})

test("Serializes flat array", withSetializerTest, {
  input: ["orange", "apple", "pineapple"],
  expected: [
    ["[0]", "orange"],
    ["[1]", "apple"],
    ["[2]", "pineapple"]
  ]
})

test("Serializes nested object", withSetializerTest, {
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
    ["some[nested][key]", "some value"],
    ["another[deep][key]", "some other value"]
  ]
})

test("Serializes collection", withSetializerTest, {
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
    ["[0][name]", "John Doe"],
    ["[0][skills][0]", "JavaScript"],
    ["[0][skills][1]", "TypeScript"],
    ["[0][skills][2]", "React"],
    ["[0][skills][3]", "Qwik"],
    ["[0][isHireable]", "true"],
    ["[1][name]", "Max Doe"],
    ["[1][skills][0]", "Python"],
    ["[1][skills][1]", "Django"],
    ["[1][skills][2]", "Flask"],
    ["[1][skills][3]", "MySQL"],
    ["[1][skills][4]", "Pony ORM"],
    ["[1][isHireable]", "false"]
  ]
})

test("Omits false object entries in strict mode", withSetializerTest, {
  strict: true,
  input: {
    name: "Max Doe",
    skills: ["Python", "Django", "Flask", "MySQL", "Pony ORM"],
    isHireable: false
  },
  expected: [
    ["name", "Max Doe"],
    ["skills[0]", "Python"],
    ["skills[1]", "Django"],
    ["skills[2]", "Flask"],
    ["skills[3]", "MySQL"],
    ["skills[4]", "Pony ORM"]
  ]
})

test("Throws an error on invalid input", t => {
  // @ts-expect-error Ignored for test purpose
  const trap = () => objectToFormData("string is not valid input")

  t.throws(trap, {
    instanceOf: TypeError,
    message: "Expected object or array as the first argument."
  })
})

test("Throws an error with invalid options", t => {
  // @ts-expect-error Ignored for test purpose
  const trap = () => objectToFormData({}, 42)

  t.throws(trap, {
    instanceOf: TypeError,
    message: "Expected the second argument to be an object or boolean."
  })
})
