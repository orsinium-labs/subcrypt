import { DecryptKey } from "./decrypt_key";
import { Types } from "./types";

export namespace EncPair {
  export async function generate(): Promise<Types.EncPair> {
    const pair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        // https://crypto.stackexchange.com/questions/1978/how-big-an-rsa-key-is-considered-secure-today
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        // https://itoolkit.co/blog/2023/08/has-the-sha-256-encryption-shown-any-vulnerability/
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    return { encrypt: pair.publicKey, decrypt: pair.privateKey };
  }

  export async function armor(pair: Types.EncPair): Promise<string> {
    return await DecryptKey.armor(pair);
  }

  export async function dearmor(base64: string): Promise<Types.EncPair> {
    const key = await DecryptKey.dearmor(base64);
    return await DecryptKey.toEncPair(key);
  }
}
