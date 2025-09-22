import { Types } from "./types";
import { arrayBufferToBase64, mergeArrayBuffers } from "./utils";

export async function hashString(password: string, salt: Types.Salt): Promise<string> {
  const enc = new TextEncoder();
  const passwordBin = enc.encode(password);
  const salted = mergeArrayBuffers([salt.salt.buffer, passwordBin.buffer]);
  const digest = await crypto.subtle.digest("SHA-256", salted);
  return arrayBufferToBase64(digest);
}
