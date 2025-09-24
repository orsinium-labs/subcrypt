import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

export namespace SymEnc {
  export async function generate(): Promise<Types.EncPair> {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
    return { encrypt: key, decrypt: key };
  }

  export async function derive(
    password: string,
    salt: Types.Salt
  ): Promise<Types.EncPair> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: 100000,
        salt: salt.salt,
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return { encrypt: key, decrypt: key };
  }

  export async function armor(pair: Types.EncPair): Promise<string> {
    const bytes = await crypto.subtle.exportKey("raw", pair.encrypt);
    return arrayBufferToBase64(bytes);
  }

  export async function dearmor(base64: string): Promise<Types.EncPair> {
    const bytes = base64ToArrayBuffer(base64);
    const key = await crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, true, [
      "encrypt",
      "decrypt",
    ]);
    return { encrypt: key, decrypt: key };
  }

  export async function armorEncrypted(
    pair: Types.EncPair,
    encKey: Types.EncryptKey,
    salt: Types.Salt
  ): Promise<string> {
    const plainBytes = await crypto.subtle.exportKey("raw", pair.encrypt);
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
  ): Promise<Types.EncPair> {
    const encBytes = base64ToArrayBuffer(base64);
    let iv = salt.salt.slice(0, 16);
    const plainBytes = await crypto.subtle.decrypt(
      { name: decKey.decrypt.algorithm.name, iv },
      decKey.decrypt,
      encBytes
    );
    const key = await crypto.subtle.importKey(
      "raw",
      plainBytes,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    return { encrypt: key, decrypt: key };
  }
}
