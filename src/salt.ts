import { Types } from "./types";

export namespace Salt {
  export function generate(): Types.Salt {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return { salt };
  }

  export function fromString(str: string): Types.Salt {
    return fromUint8Array(stringToUint8Array(str));
  }

  export function fromArray(arr: number[]): Types.Salt {
    return fromUint8Array(new Uint8Array(arr));
  }

  export function fromUint8Array(arr: Uint8Array<ArrayBuffer>): Types.Salt {
    return { salt: arr };
  }
}

export function stringToUint8Array(
  binaryString: string
): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
