# object-to-form-data

Transform an object/collection to FormData.
Good to use with [then-busboy](https://github.com/octet-stream/then-busboy)

## API

`serialize(object[, root]) -> FormData`

  * **{object}** object – An object to transform
  * **{string}** root – Root key of a fieldname

## Usage

```js
import serialize from "object-to-form-data"
import fetch from "isomorphic-fetch"

const object = {
  message: {
    sender: "Glim Glam",
    text: "Some whatever text message.",
    attachments: [
      {
        file: File, // this field will be represended as a File instance
        description: "Here is a description of the file"
      }
    ]
  }
}

// You will receive a FormData instance with all fields of given object
const body = serialize()

const onResponse = res => res.json()

const onFulfilled = data => console.log(data)

const onRejected = err => console.error(err)

fetch("https://api.whatever.co/pong", {method: "POST", body})
  .then(onResponse).then(onFulfilled, onRejected)
```
