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
    const pubKey = await extractPubKey(key.sign);
    return { sign: key.sign, verify: pubKey };
  }
}

async function extractPubKey(privKey: CryptoKey): Promise<CryptoKey> {
  const jwk = await crypto.subtle.exportKey("jwk", privKey);

  delete jwk.d;
  delete jwk.dp;
  delete jwk.dq;
  delete jwk.q;
  delete jwk.qi;
  jwk.key_ops = ["verify"];

  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-PSS", hash: "SHA-256" },
    true,
    ["verify"]
  );
}
