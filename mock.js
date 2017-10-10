class FormData extends Map {
  append(key, value) {
    return this.set(key, value)
  }
}

global.FormData = FormData
