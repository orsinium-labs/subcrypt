import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

export namespace SignKey {
  export function fromSignPair(pair: Types.SignPair): Types.SignKey {
    return { sign: pair.sign };
  }

  export async function armor(pair: Types.SignKey): Promise<string> {
    const plainBytes = await crypto.subtle.exportKey("pkcs8", pair.sign);
    return arrayBufferToBase64(plainBytes);
  }

  export async function dearmor(base64: string): Promise<Types.SignKey> {
    const bytes = base64ToArrayBuffer(base64);
    const key = await crypto.subtle.importKey(
      "pkcs8",
      bytes,
      { name: "RSA-PSS", hash: "SHA-256" },
      true,
      ["sign"]
    );
    return { sign: key };
  }
}
