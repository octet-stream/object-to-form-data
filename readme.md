# object-to-form-data

Serialize objects, arrays and collections into [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

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

## CJS/ESM support

This module supports both CommonJS and ES Modules.

## Usage

1. To use this package, just import `objectToFormData` and pass `input` data as the first argument:

```ts
import {objectToFormData} from "@octetstream/object-to-form-data"

const user = {
  name: "The Octocat",
  login: "octocat",
  url: "https://github.com/octocat",
  repositories: {
    nodes: [
      {
        name: "Hello-World",
        description: "My first repository on GitHub!",
        url: "https://github.com/octocat/Hello-World"
      }
    ]
  }
}

// You will receive a FormData instance with all fields of given object
const form = objectToFormData(user)

const options = {
  method: "post",
  body: form
}

const response = await fetch("https://httpbin.org/post", options)
```

The `user` object from this example will be serailized into FormData with following structure (pseudo code):

```
name = "The Octocat"
login = "octocat"
url = "https://github.com/octocat"
repositories[nodes][0][name] = "Hello-World"
repositories[nodes][0][description] = "My first repository on GitHub!"
repositories[nodes][0][url] = "https://github.com/octocat/Hello-World"
```

2. By default the `bracked` notation is applied, but use can pass `dot` as `notation` option like this:

```ts
import {objectToFormData} from "@octetstream/object-to-form-data"

const person = {
  name: "Nick K.",
  url: "https://github.com/octet-stream",
  skills: ["TypeScript", "JavaScript", "React", "Next.js", "Vue", "Nuxt", "Qwik", "Docker"]
}

const form = objectToFormData(person, {
  notation: "dot" // This will enable dot notation for serialization
})
```

Returned `form` object has following structure:

```
name = "Nick K."
url = "https://github.com/octet-stream"
skills.0 = TypeScript
skills.1 = JavaScript
skills.2 = React
skills.3 = Next.js
skills.4 = Vue
skills.5 = Nuxt
skills.6 = Qwik
skills.7 = Docker
```

3. You can also pass collections as the input:

```ts
import {objectToFormData} from "@octetstream/object-to-form-data"

const developers = [
  {
    name: "John Doe",
    skills: ["JavaScript", "TypeScript", "React", "Qwik"],
    isHireable: true
  },
  {
    name: "Max Doe",
    skills: ["Python", "Django", "Flask", "MySQL", "Pony ORM"],
    isHireable: false
  }
]

const form = objectToFormData(developers)
```

This results in following `form` structure:

```
[0][name] = "John Doe"
[0][skills][0] = "JavaScript"
[0][skills][1] = "TypeScript"
[0][skills][2] = "React"
[0][skills][3] = "Qwik"
[1][name] = "Max Doe"
[1][skills][0] = "Python"
[1][skills][1] = "Django"
[1][skills][2] = "Flask"
[1][skills][3] = "MySQL"
[1][skills][4] = "Pony ORM"
```

4. Flat arrays supported too:

```ts
import {objectToFormData} from "@octetstream/object-to-form-data"

const fruits = ["orange", "pineapple", "nectarine", "pear", "pomegranate"]

const form = objectToFormData(fruits)
```

Result:

```
[0] = "orange"
[1] = "pineapple"
[2] = "nectarine"
[3] = "pear"
[4] = "pomegranate"
```

5. Serializing files and blobs:

```ts
import {objectToFormData} from "@octetstream/object-to-form-data"

const input = [
  {
    caption: "Text file created with File object",
    file: new File(["My hovercraft if full of eels"], "test.txt", {type: "text/plain"}),
  },
  {
    caption: "Text data created with Blob object",
    file: new Blob(["On Soviet Moon landscape see binoculars through you"], {type: "text/plain"}),
  }
]

const form = objectToFormData(input)
```

Result:

```
[0][caption] = "Text file created with File object"
[0][file] = File [type: "text/plain", name: "test.txt", content: "My hovercraft if full of eels"]
[1][caption] = "Text data created with Blob object"
[1][file] = File [type: "text/plain", name: "blob", content: "On Soviet Moon landscape see binoculars through you"]
```

## API

### `objectToFormData(input[, options]): FormData`

Serializes objects, arrays and collections into `FormData`.

Nested objects will be flattened using either dot or bracket notation.

This function takes following arguments:

| Name    | Type                                                            | Required  | Default     | Description                      |
|---------|:---------------------------------------------------------------:|:---------:|:-----------:|----------------------------------|
| input   | `unknown[] \| Record<sting \| number, unknown>`                 | true      | –           | An object to transform           |
| options | [`ObjectToFormDataOptions`](#interface-objecttoformdataoptions) | false     | `undefined` | Additional serialization options |

Returns `FormData` instance.

### `interface ObjectToFormDataOptions`

Serialization options

| Name           | Type                                     | Required | Default               | Description                                                                                                   |
|----------------|:----------------------------------------:|:--------:|:---------------------:|---------------------------------------------------------------------------------------------------------------|
| strict         | `boolean`                                | false    | `false`               | Indicates whether or not to omit every `false` values. Applied enabled. Does not affect boolean array values  |
| FormData       | `FormData`                               | false    | `globalThis.FormData` | Custom spec-compliant [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) implementation  |
| notation       | `"dot" \| "bracket"`                     | false    | `"bracket"`           | Type of the nested fields notation. Can be either `"dot"` or `"bracket"`                                      |
| normalizeValue | [`NormalizeValue`](#type-normalizevalue) | false    | `undefined`           | Value normalizer. This function will be called on each *scalar* value, before it's added to FormData instance |

### `interface NormalizeValue`

Value normalizer.

A function to be called on each *scalar* value, before it's added to FormData instance. It **must** return either `Blob` or `string`

This function will be called with the following arguments:

| Name    | Type                      | Description                         |
|---------|:-------------------------:|-------------------------------------|
| value   | `unknown`                 | Current entry value                 |
| name    | `string`                  | The name of the entry               |
| path    | `Array<string \| number>` | Entry's path within original object |

This function **must** return either `Blob` or `string`. Any unsupported type will be converted to string by `FormData`.

## Related links

- [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) documentation on MDN
- [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) documentation on MDN
- [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) documentation on MDN
- [`FormDataValue`](https://developer.mozilla.org/en-US/docs/Web/API/FormDataEntryValue) documentation on MDN.
- [`formdata-node`](https://github.com/octet-stream/form-data) Spec-compliant `FormData` implementation for Node.js.
- [`formdata-polyfill`](https://github.com/jimmywarting/FormData) HTML5 `FormData` for Browsers & NodeJS.
- [`node-fetch`](https://github.com/node-fetch/node-fetch) a light-weight module that brings the Fetch API to Node.js
- [`fetch-blob`](https://github.com/node-fetch/fetch-blob) a Blob implementation for Node.js, originally from `node-fetch`.
- [`form-data-encoder`](https://github.com/octet-stream/form-data-encoder) spec-compliant `multipart/form-data` encoder implementation.
- [`then-busboy`](https://github.com/octet-stream/then-busboy) a promise-based wrapper around Busboy. Process `multipart/form-data` content and returns it as a single object. Will be helpful to handle your data on the server-side applications.
