import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

/** Operations on RSA-PSS public key. */
export namespace VerifyKey {
  /** Export RSA-PSS public key as base64-encoded spki. */
  export async function armor(key: Types.VerifyKey): Promise<string> {
    const bytes = await crypto.subtle.exportKey("spki", key.verify);
    return arrayBufferToBase64(bytes);
  }

  export async function dearmor(base64: string): Promise<Types.VerifyKey> {
    const bytes = base64ToArrayBuffer(base64);
    const key = await crypto.subtle.importKey(
      "spki",
      bytes,
      { name: "RSA-PSS", hash: "SHA-256" },
      true,
      ["verify"]
    );
    return { verify: key };
  }
}
