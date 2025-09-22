import { EncryptKey } from "./encrypt_key";
import { Types } from "./types";

export namespace EncPair {
  export async function generate(): Promise<Types.EncPair> {
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
    return { encrypt: pair.publicKey, decrypt: pair.privateKey };
  }

  export async function encrypt(key: Types.EncPair, data: string): Promise<string> {
    return await EncryptKey.encrypt(key, data);
  }
}
