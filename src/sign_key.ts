import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer, stringToArrayBuffer } from "./utils";

export namespace SignKey {
  export async function generate(): Promise<Types.SignKey> {
    const pair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    return { sign: pair.privateKey };
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

  export async function armorEncrypted(
    signKey: Types.SignKey,
    encKey: Types.EncryptKey,
    salt: Types.Salt
  ): Promise<string> {
    const plainBytes = await crypto.subtle.exportKey("pkcs8", signKey.sign);
    let iv = salt.salt.slice(0, 16);
    const encBytes = await crypto.subtle.encrypt(
      { name: encKey.encrypt.algorithm.name, iv },
      encKey.encrypt,
      plainBytes
    );
    return arrayBufferToBase64(encBytes);
  }

  export async function dearmorEncrypted(
    base64: string,
    decKey: Types.DecryptKey,
    salt: Types.Salt
  ): Promise<Types.SignKey> {
    const encBytes = base64ToArrayBuffer(base64);
    let iv = salt.salt.slice(0, 16);
    const plainBytes = await crypto.subtle.decrypt(
      { name: decKey.decrypt.algorithm.name, iv },
      decKey.decrypt,
      encBytes
    );
    const key = await crypto.subtle.importKey(
      "pkcs8",
      plainBytes,
      { name: "RSA-PSS", hash: "SHA-256" },
      true,
      ["sign"]
    );
    return { sign: key };
  }

  export async function sign(key: Types.SignKey, data: string): Promise<string> {
    let signature = await crypto.subtle.sign(
      {
        name: key.sign.algorithm.name,
        saltLength: 32,
      },
      key.sign,
      stringToArrayBuffer(data)
    );
    return arrayBufferToBase64(signature);
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
    { name: privKey.algorithm.name, hash: "SHA-256" },
    true,
    ["verify"]
  );
}
