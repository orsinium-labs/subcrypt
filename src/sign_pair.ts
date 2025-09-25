import { SignKey } from "./sign_key";
import { Types } from "./types";

export namespace SignPair {
  export async function generate(): Promise<Types.SignPair> {
    const pair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        // https://crypto.stackexchange.com/questions/1978/how-big-an-rsa-key-is-considered-secure-today
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        // https://itoolkit.co/blog/2023/08/has-the-sha-256-encryption-shown-any-vulnerability/
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    return { sign: pair.privateKey, verify: pair.publicKey };
  }

  export async function armor(pair: Types.SignPair): Promise<string> {
    return SignKey.armor(pair);
  }

  export async function dearmor(base64: string): Promise<Types.SignPair> {
    const key = await SignKey.dearmor(base64);
    return await SignKey.toSignPair(key);
  }

  export async function armorEncrypted(
    pair: Types.SignPair,
    encKey: Types.EncryptKey,
    salt: Types.Salt
  ): Promise<string> {
    return await SignKey.armorEncrypted(pair, encKey, salt);
  }

  export async function dearmorEncrypted(
    base64: string,
    decKey: Types.DecryptKey,
    salt: Types.Salt
  ): Promise<Types.SignPair> {
    const key = await SignKey.dearmorEncrypted(base64, decKey, salt);
    return await SignKey.toSignPair(key);
  }
}
