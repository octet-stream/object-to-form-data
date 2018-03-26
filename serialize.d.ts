type TIterable = any[] | {[key : string] : any}

declare function serialize(iterable : TIterable, root ?: string) : FormData

export default serialize
