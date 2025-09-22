import { Types } from "./types";
import { arrayBufferToBase64 } from "./utils";

export async function hashString(password: string, salt: Types.Salt): Promise<string> {
  const enc = new TextEncoder();
  const passwordBin = enc.encode(password);
  const salted = mergeArrayBuffers([salt.salt.buffer, passwordBin.buffer]);
  const digest = await crypto.subtle.digest("SHA-256", salted);
  return arrayBufferToBase64(digest);
}

function mergeArrayBuffers(abs: ArrayBufferLike[]): ArrayBuffer {
  let length = 0;
  for (const v of abs) {
    length += v.byteLength;
  }

  let merged = new Uint8Array(length);
  let offset = 0;
  for (const ab of abs) {
    const uint8view = new Uint8Array(ab, 0, ab.byteLength);
    merged.set(uint8view, offset);
    offset += uint8view.byteLength;
  }
  return merged.buffer;
}
