const test = require("ava")

const FormData = require("formdata-node").default

const serialize = require("./serialize")
const isPlainObject = require("./isPlainObject")

test("Should always return a FormData instance", t => {
  const fd = serialize({})

  t.true(fd instanceof FormData)
})

test("Should correctly create a FormData from flat object", t => {
  const person = {
    name: "J. Doe",
    age: 21,
    career: "Developer"
  }

  const fd = serialize(person)

  t.true(fd.has("name"))
  t.true(fd.has("age"))
  t.true(fd.has("career"))

  t.is(fd.get("name"), person.name)
  t.is(fd.get("age"), String(person.age))
  t.is(fd.get("career"), person.career)
})

test("Should correctly create a FormData for object with nested fields", t => {
  const object = {
    birth: {
      day: 12,
      month: "Mar.",
      year: 1986
    }
  }

  const fd = serialize(object)

  t.true(fd.has("birth[day]"))
  t.true(fd.has("birth[month]"))
  t.true(fd.has("birth[year]"))

  t.is(fd.get("birth[day]"), String(object.birth.day))
  t.is(fd.get("birth[month]"), object.birth.month)
  t.is(fd.get("birth[year]"), String(object.birth.year))
})

test("Should skip \"false\" booleans in strict mode", t => {
  const fd = serialize.strict({
    trueValue: true,
    string: "In Soviet Moon, landscape see binoculars through YOU.",
    falseValue: false,
    number: 42
  })

  t.true(fd.has("trueValue"))
  t.true(fd.has("string"))
  t.false(fd.has("falseValue"))
  t.true(fd.has("number"))
})

test("Should allow booleans as the second argument", t => {
  t.false(serialize({falseValue: false}, true).has("falseValue"))
})

test("Should allow string as the second argument", t => {
  t.true(serialize({name: "John Doe"}, "root").has("root[name]"))
})

test("Should throw a TypeError when no argument passed", t => {
  const err = t.throws(serialize)

  t.true(err instanceof TypeError)
  t.is(err.message, "Expected object or array as the first argument.")
})

test("Should throw a TypeError even if passed only the second argument", t => {
  const trap = () => serialize(undefined, "root")

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Expected object or array as the first argument.")
})

test(
  "Should throw a TypeError when second argument is not kind of " +
  "string, boolean or object type",
  t => {
    const trap = () => serialize({}, 42)

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "The second argument can be an object, boolean or string value."
    )
  }
)

// Tests for isPlainObject
test("isPlainObject: Should return true on object created from literal", t => {
  t.true(isPlainObject({}))
})

test("isPlainObject: Should return true on Object.create(null) objects", t => {
  t.true(isPlainObject(Object.create(null)))
})

test("isPlainObject: Should return false on non-object value", t => {
  t.false(isPlainObject(451))
})
