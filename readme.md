# object-to-form-data

Transform an object/collection to FormData.
Good to use with [then-busboy](https://github.com/octet-stream/then-busboy)

[![dependencies Status](https://david-dm.org/octet-stream/object-to-form-data/status.svg)](https://david-dm.org/octet-stream/object-to-form-data)
[![devDependencies Status](https://david-dm.org/octet-stream/object-to-form-data/dev-status.svg)](https://david-dm.org/octet-stream/object-to-form-data?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/object-to-form-data.svg?branch=master)](https://travis-ci.org/octet-stream/object-to-form-data)
[![Code Coverage](https://codecov.io/github/octet-stream/object-to-form-data/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/object-to-form-data?branch=master)

## API

`serialize(object[, options]) -> {FormData}`

  * **{object}** object – Object to transform
  * **{object | string | boolean}** options – Serialization options.
    This argument might be an object with "root" and "strict" parameters.
    Or you can pass one of them as the second argument:
      + **{boolean}** [strict = false] – if set to `true`, all `false` boolean
        values will be omitted.
      + **{string}** [root = null] – Just a root key of all fieldnames

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

// You will receive a FormData instance with all fields of given object
const body = serialize(object)

const options = {
  method: "POST", body
}

const onResponse = res => res.json()

const onData = data => console.log(data)

const onError = err => console.error(err)

fetch("https://api.whatever.co/ping", options)
  .then(onResponse).then(onData, onError)
```

**Important!** If you're using this library for Node.js environments,
you also need the [formdata-node](https://github.com/octet-stream/form-data)
to serialize your objects/collections.
See documentation of this implementation to learn how to send queries
with that implementation.
