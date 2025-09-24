import { Types } from "./types";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

/** Operations on RSA-OAEP private key. */
export namespace DecryptKey {
  export async function toEncPair(key: Types.DecryptKey): Promise<Types.EncPair> {
    const pubKey = await extractPubKey(key.decrypt);
    return { encrypt: pubKey, decrypt: key.decrypt };
  }

  export async function toSignKey(key: Types.DecryptKey): Promise<Types.SignKey> {
    const sign = await oaepToPss(key.decrypt);
    return { sign };
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

async function oaepToPss(pss: CryptoKey): Promise<CryptoKey> {
  const jwk = await crypto.subtle.exportKey("jwk", pss);
  jwk.key_ops = ["sign"];
  const oaep = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-PSS", hash: "SHA-256" },
    true,
    ["sign"]
  );

  return oaep;
}
