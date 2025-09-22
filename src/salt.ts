import { Types } from "./types";

export namespace Salt {
  export function generate(): Types.Salt {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return { salt };
  }
}
