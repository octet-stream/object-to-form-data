const test = require("ava")

const isPlainObject = require("./isPlainObject")

test("isPlainObject: Should return true on object created from literal", t => {
  t.true(isPlainObject({}))
})

test("isPlainObject: Should return true on Object.create(null) objects", t => {
  t.true(isPlainObject(Object.create(null)))
})

test("isPlainObject: Should return false on non-object value", t => {
  t.false(isPlainObject(451))
})
