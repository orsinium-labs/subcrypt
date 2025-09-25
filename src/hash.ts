import { Types } from "./types";
import { arrayBufferToBase64 } from "./utils";

/** Generate SHA-256 hash of the given string.
 *
 * Optionally accepts salt to be prepended to the string.
 * You should always use salt when hashing passwords or other
 * relatively short values to prevent rainbow tables attack.
 */
export async function hashString(
  password: string,
  salt?: Types.Salt
): Promise<string> {
  const enc = new TextEncoder();
  let binary: BufferSource = enc.encode(password);
  if (salt) {
    binary = mergeArrayBuffers([salt.salt.buffer, binary.buffer]);
  }
  const digest = await crypto.subtle.digest("SHA-256", binary);
  return arrayBufferToBase64(digest);
}

function mergeArrayBuffers(abs: ArrayBufferLike[]): ArrayBuffer {
  let length = 0;
  for (const v of abs) {
    length += v.byteLength;
  }

  const merged = new Uint8Array(length);
  let offset = 0;
  for (const ab of abs) {
    const uint8view = new Uint8Array(ab, 0, ab.byteLength);
    merged.set(uint8view, offset);
    offset += uint8view.byteLength;
  }
  return merged.buffer;
}
