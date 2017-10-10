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
