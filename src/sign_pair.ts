import { Types } from "./types";

export async function generate(): Promise<Types.SignPair> {
  const pair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );
  return { sign: pair.privateKey, verify: pair.publicKey };
}
