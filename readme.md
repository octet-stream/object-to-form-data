# object-to-form-data

Transform an object/collection to FormData.
Good to use with [then-busboy](https://github.com/octet-stream/then-busboy)

[![dependencies Status](https://david-dm.org/octet-stream/object-to-form-data/status.svg)](https://david-dm.org/octet-stream/object-to-form-data)
[![devDependencies Status](https://david-dm.org/octet-stream/object-to-form-data/dev-status.svg)](https://david-dm.org/octet-stream/object-to-form-data?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/object-to-form-data.svg?branch=master)](https://travis-ci.org/octet-stream/object-to-form-data)
[![Code Coverage](https://codecov.io/github/octet-stream/object-to-form-data/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/object-to-form-data?branch=master)

## API

`serialize(object[, root]) -> {FormData}`

  * **{object}** object – Object to transform
  * **{string}** root – Root key of a fieldname

## Usage

```js
import serialize from "@octetstream/object-to-form-data"

const object = {
  message: {
    sender: "Glim Glam",
    text: "Can you believe it, Trixie?",
    attachments: [
      {
        file: File, // this field will be represended as a window.File instance
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
