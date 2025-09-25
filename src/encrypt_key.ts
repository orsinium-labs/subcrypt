import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

/** Operations on RSA-OAEP public key. */
export namespace EncryptKey {
  /** Export the given RSA-OAEP public decryption key as base64-encoded spki. */
  export async function armor(key: Types.EncryptKey): Promise<string> {
    const bytes = await crypto.subtle.exportKey("spki", key.encrypt);
    return arrayBufferToBase64(bytes);
  }

  /** Import the given base64-encoded spki as RSA-OAEP public decryption key. */
  export async function dearmor(base64: string): Promise<Types.EncryptKey> {
    const bytes = base64ToArrayBuffer(base64);
    const key = await crypto.subtle.importKey(
      "spki",
      bytes,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"],
    );
    return { encrypt: key };
  }
}
