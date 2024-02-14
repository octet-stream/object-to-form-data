# object-to-form-data

Transform an object/collection to FormData.
Good to use with [then-busboy](https://github.com/octet-stream/then-busboy)

[![Code Coverage](https://codecov.io/github/octet-stream/object-to-form-data/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/object-to-form-data?branch=master)
[![CI](https://github.com/octet-stream/object-to-form-data/workflows/CI/badge.svg)](https://github.com/octet-stream/object-to-form-data/actions/workflows/ci.yml)
[![ESLint](https://github.com/octet-stream/object-to-form-data/workflows/ESLint/badge.svg)](https://github.com/octet-stream/object-to-form-data/actions/workflows/eslint.yml)

## Installation

pnpm:

```sh
pnpm add @octetstream/object-to-form-data
```

npm:
```sh
npm i @octetstream/object-to-form-data
```

## Usage

```js
import {objectToFormData} from "@octetstream/object-to-form-data"

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
const form = objectToFormData(object)

const options = {
  method: "post",
  body: form
}

const response = await fetch("https://httpbin.org/post", options)
```

## API

### `objectToFormData(input[, options]): FormData`

Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values

This function takes following arguments:

| Name    | Type                                                            | Required  | Default     | Description                      |
|---------|:---------------------------------------------------------------:|:---------:|:-----------:|----------------------------------|
| input   | `unknown[] \| Record<sting \| number, unknown>`                 | true      | –           | An object to transform           |
| options | [`ObjectToFormDataOptions`](#interface-objecttoformdataoptions) | false     | `undefined` | Additional serialization options |

### `interface ObjectToFormDataOptions`

Serialization options

| Name           | Type                                     | Required | Default               | Description                                                                                                   |
|----------------|:----------------------------------------:|:--------:|:---------------------:|---------------------------------------------------------------------------------------------------------------|
| strict         | `boolean`                                | false    | `false`               | Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values  |
| FormData       | `FormData`                               | false    | `globalThis.FormData` | Custom spec-compliant [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) implementation  |
| notation       | `"dot" \| "bracket"`                     | false    | `"bracket"`           | Type of the path notation. Can be either `"dot"` or `"bracket"`                                               |
| normalizeValue | [`NormalizeValue`](#type-normalizevalue) | false    | `undefined`           | Value normalizer. This function will be called on each *scalar* value, before it's added to FormData instance |

### `type NormalizeValue`

Value normalizer.

This function will be called on each *scalar* value, before it's added to FormData instance. It **must** return either `Blob` or `string`

This function will be called with the following arguments:

| Name    | Type                      | Description                         |
|---------|:-------------------------:|-------------------------------------|
| value   | `unknown`                 | Current entry value                 |
| name    | `string`                  | The name of the entry               |
| path    | `Array<string \| number>` | Entry's path within original object |
