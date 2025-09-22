import { Types } from "./types";

export namespace Salt {
  export function generate(): Types.Salt {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return { salt };
  }

  export function fromArray(arr: number[]): Types.Salt {
    return fromUint8Array(new Uint8Array(arr));
  }

  export function fromUint8Array(arr: Uint8Array<ArrayBuffer>): Types.Salt {
    return { salt: arr };
  }
}
