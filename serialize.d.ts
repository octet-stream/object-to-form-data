type Input = any[] | {[key: string]: any}

interface Options {
  strict?: boolean
}

declare function serialize(input: Input): FormData
declare function serialize(input: Input, strict?: boolean): FormData
declare function serialize(input: Input, options?: Options | boolean) : FormData

declare namespace serialize {
  export function strict(input: Input): FormData
}

export default serialize
