type TIterable = any[] | {[key : string] : any}

type TOptions = boolean | string | {
  root ?: string,
  strict ?: boolean
}

declare function serialize(iterable : TIterable, root ?: TOptions) : FormData

export default serialize
