import { Types } from "./types";

export namespace EncPair {
  export async function derive(
    password: string,
    salt: Types.Salt
  ): Promise<Types.EncPair> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: 100000,
        salt: salt.salt,
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return { encrypt: key, decrypt: key };
  }
}
