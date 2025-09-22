import { SignKey } from "./sign_key";
import { Types } from "./types";

export namespace SignPair {
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

  export function toSignKey(pair: Types.SignPair): Types.SignKey {
    return { sign: pair.sign };
  }

  export function toVerifyKey(pair: Types.SignPair): Types.VerifyKey {
    return { verify: pair.verify };
  }

  export async function fromSignKey(key: Types.SignKey): Promise<Types.SignPair> {
    return await SignKey.toSignPair(key);
  }

  export async function armor(pair: Types.SignPair): Promise<string> {
    return SignKey.armor(toSignKey(pair));
  }

  export async function dearmor(base64: string): Promise<Types.SignPair> {
    const key = await SignKey.dearmor(base64);
    return await fromSignKey(key);
  }

  export async function armorEncrypted(
    pair: Types.SignPair,
    encKey: Types.EncryptKey,
    salt: Types.Salt
  ): Promise<string> {
    return await SignKey.armorEncrypted(toSignKey(pair), encKey, salt);
  }

  export async function dearmorEncrypted(
    base64: string,
    decKey: Types.DecryptKey,
    salt: Types.Salt
  ): Promise<Types.SignPair> {
    const key = await SignKey.dearmorEncrypted(base64, decKey, salt);
    return await fromSignKey(key);
  }

  export async function sign(pair: Types.SignPair, data: string): Promise<string> {
    return await SignKey.sign(toSignKey(pair), data);
  }
}
