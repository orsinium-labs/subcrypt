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

  export async function armor(pair: Types.SignPair): Promise<string> {
    return SignKey.armor(toSignKey(pair));
  }

  export async function dearmor(base64: string): Promise<Types.SignPair> {
    const key = await SignKey.dearmor(base64);
    return await SignKey.toSignPair(key);
  }
}
