try {
  module.exports = require("formdata-node").default
} catch (err) {
  if (err.code !== "MODULE_NOT_FOUND") {
    throw err
  }

  throw new Error(
    "Seems like you haven't installed \"formdata-node\" module. " +
    "This one required for Node.js.\nPlease, install this module " +
    "manually: npm i -S formdata-node"
  )
}

