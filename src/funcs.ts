import { Types } from "./types";
import {
  arrayBufferToBase64,
  arrayBufferToString,
  base64ToArrayBuffer,
  stringToArrayBuffer,
} from "./utils";

export async function encrypt(
  key: Types.EncryptKey,
  data: string,
  salt?: Types.Salt
): Promise<string> {
  const plainBinary = stringToArrayBuffer(data);
  let iv = undefined;
  if (salt) {
    iv = salt.salt.slice(0, 16);
  }
  const encryptedBinary = await crypto.subtle.encrypt(
    { name: key.encrypt.algorithm.name, iv },
    key.encrypt,
    plainBinary
  );
  return arrayBufferToBase64(encryptedBinary);
}

export async function decrypt(
  key: Types.DecryptKey,
  base64: string,
  salt?: Types.Salt
): Promise<string> {
  const encryptedBinary = base64ToArrayBuffer(base64);
  let iv = undefined;
  if (salt) {
    iv = salt.salt.slice(0, 16);
  }
  const plainBinary = await crypto.subtle.decrypt(
    { name: key.decrypt.algorithm.name, iv },
    key.decrypt,
    encryptedBinary
  );
  return arrayBufferToString(plainBinary);
}

/** Generate signtaure for the given string using a private signing key. */
export async function sign(key: Types.SignKey, data: string): Promise<string> {
  const signature = await crypto.subtle.sign(
    {
      name: key.sign.algorithm.name,
      saltLength: 32,
    },
    key.sign,
    stringToArrayBuffer(data)
  );
  return arrayBufferToBase64(signature);
}

/** Verify signtaure for the given string using a public verification key. */
export async function verify(
  key: Types.VerifyKey,
  data: string,
  signature: string
): Promise<boolean> {
  return await crypto.subtle.verify(
    {
      name: key.verify.algorithm.name,
      saltLength: 32,
    },
    key.verify,
    base64ToArrayBuffer(signature),
    stringToArrayBuffer(data)
  );
}
