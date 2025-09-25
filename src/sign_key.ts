import { Types } from "./types";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
} from "./utils";

/** Operations on RSA-PSS private key. */
export namespace SignKey {
  export async function toSignPair(
    key: Types.SignKey
  ): Promise<Types.SignPair> {
    const pubKey = await extractPubKey(key.sign);
    return { sign: key.sign, verify: pubKey };
  }

  export async function toDecryptKey(
    key: Types.SignKey
  ): Promise<Types.DecryptKey> {
    const decrypt = await pssToOaep(key.sign);
    return { decrypt };
  }

  /** Export RSA-PSS private key as base64-encoded pkcs8.
   *
   * Keep in mind that public key can be derived from private key.
   * So, sharing exported RSA-PSS private key is the same as sharing
   * exported SignPair.
   */
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

async function pssToOaep(pss: CryptoKey): Promise<CryptoKey> {
  const jwk = await crypto.subtle.exportKey("jwk", pss);
  jwk.key_ops = ["decrypt"];
  const oaep = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );

  return oaep;
}
