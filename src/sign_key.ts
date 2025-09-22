import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

export namespace SignKey {
  export function fromSignPair(pair: Types.SignPair): Types.SignKey {
    return { sign: pair.sign };
  }

  export async function toSignPair(key: Types.SignKey): Promise<Types.SignPair> {
    const pubKey = await extractPubKey(key.sign);
    return { sign: key.sign, verify: pubKey };
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
