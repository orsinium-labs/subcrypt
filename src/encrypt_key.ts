import { Types } from "./types";
import { arrayBufferToBase64, stringToArrayBuffer } from "./utils";

export namespace EncryptKey {
  export async function generate(): Promise<Types.EncryptKey> {
    const pair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    return { encrypt: pair.publicKey };
  }

  export async function encrypt(key: Types.EncryptKey, data: string): Promise<string> {
    const plainBinary = stringToArrayBuffer(data);
    const encryptedBinary = await crypto.subtle.encrypt(
      { name: key.encrypt.algorithm.name },
      key.encrypt,
      plainBinary
    );
    return arrayBufferToBase64(encryptedBinary);
  }
}
