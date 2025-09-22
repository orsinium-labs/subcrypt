import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer, stringToArrayBuffer } from "./utils";

export namespace VerifyKey {
  export function fromSignPair(pair: Types.SignPair): Types.VerifyKey {
    return { verify: pair.verify };
  }

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

  export async function verify(
    key: Types.VerifyKey,
    data: string,
    signature: string
  ): Promise<boolean> {
    return await crypto.subtle.verify(
      {
        name: key.verify.algorithm.name,
        saltLength: 32,
      },
      key.verify,
      base64ToArrayBuffer(signature),
      stringToArrayBuffer(data)
    );
  }
}
