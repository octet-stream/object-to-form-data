type Iterable = any[] | {[key: string]: any}

type Options = boolean | string | {
  root?: string,
  strict?: boolean
}

declare function serialize(iterable: Iterable, root?: Options | string | boolean) : FormData

export default serialize
