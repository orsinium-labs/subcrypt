import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

export namespace DecryptKey {
  export async function generate(): Promise<Types.DecryptKey> {
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
    return { decrypt: pair.privateKey };
  }

  export async function toEncPair(key: Types.DecryptKey): Promise<Types.EncPair> {
    const pubKey = await extractPubKey(key.decrypt);
    return { encrypt: pubKey, decrypt: key.decrypt };
  }

  export async function armor(key: Types.DecryptKey): Promise<string> {
    const bytes = await crypto.subtle.exportKey("pkcs8", key.decrypt);
    return arrayBufferToBase64(bytes);
  }

  export async function dearmor(base64: string): Promise<Types.DecryptKey> {
    const bytes = base64ToArrayBuffer(base64);
    const key = await crypto.subtle.importKey(
      "pkcs8",
      bytes,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
    return { decrypt: key };
  }
}

async function extractPubKey(privKey: CryptoKey): Promise<CryptoKey> {
  const jwk = await crypto.subtle.exportKey("jwk", privKey);

  delete jwk.d;
  delete jwk.dp;
  delete jwk.dq;
  delete jwk.q;
  delete jwk.qi;
  jwk.key_ops = ["encrypt", "decrypt"];

  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}
