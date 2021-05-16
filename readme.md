# object-to-form-data

Transform an object/collection to FormData.
Good to use with [then-busboy](https://github.com/octet-stream/then-busboy)

[![Code Coverage](https://codecov.io/github/octet-stream/object-to-form-data/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/object-to-form-data?branch=master)
[![CI](https://github.com/octet-stream/object-to-form-data/workflows/CI/badge.svg)](https://github.com/octet-stream/object-to-form-data/actions/workflows/ci.yml)
[![ESLint](https://github.com/octet-stream/object-to-form-data/workflows/ESLint/badge.svg)](https://github.com/octet-stream/object-to-form-data/actions/workflows/eslint.yml)

## API

`serialize(object[, options]) -> {FormData}`

  * **{object}** object – Object to transform
  * **{object | boolean}** options – Serialization options.
    This argument might be an object with "root" and "strict" parameters.
    Or you can pass one of them as the second argument:
      + **{boolean}** [strict = false] – if set to `true`, all `false` boolean
        values will be omitted.

## Usage

```js
import serialize from "@octetstream/object-to-form-data"

const object = {
  message: {
    sender: "Glim Glam",
    text: "Can you believe it, Trixie?",
    attachments: [
      {
        file: File, // this field will be represented as a window.File instance
        description: "I beat Twilight Sparkle and all I got was this lousy t-shirt."
      }
    ]
  }
}

const options = {
  method: "post",

  // You will receive a FormData instance with all fields of given object
  body: serialize(object)
}

const response = await fetch("https://httpbin.org/post", options)
```

**Important!** If you're using this library in Node.js, you also need the [formdata-node](https://github.com/octet-stream/form-data) package to serialize your objects/collections. See documentation of this implementation to learn how to send queries with that implementation.
