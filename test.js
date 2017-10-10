const test = require("ava")

const serialize = require("./serialize")

test("Should always return a FormData instance", t => {
  t.plan(1)

  const fd = serialize({})

  t.true(fd instanceof FormData)
})

test("Should correctly create a FormData from flat object", t => {
  t.plan(6)

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
  t.is(fd.get("age"), person.age)
  t.is(fd.get("career"), person.career)
})

test("Should correctly create a FormData for object with nested fields", t => {
  t.plan(6)

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

  t.is(fd.get("birth[day]"), object.birth.day)
  t.is(fd.get("birth[month]"), object.birth.month)
  t.is(fd.get("birth[year]"), object.birth.year)
})

test("Should throw a TypeError when no argument passed", t => {
  t.plan(3)

  const err = t.throws(serialize)

  t.true(err instanceof TypeError)
  t.is(err.message, "Expected object or array as the first argument.")
})

test("Should throw a TypeError even if passed only the second argument", t => {
  t.plan(3)

  const trap = () => serialize(undefined, "root")

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Expected object or array as the first argument.")
})
