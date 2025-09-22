import { Types } from "./types";
import {
  arrayBufferToBase64,
  arrayBufferToString,
  base64ToArrayBuffer,
  stringToArrayBuffer,
} from "./utils";

export async function encrypt(key: Types.EncryptKey, data: string): Promise<string> {
  const plainBinary = stringToArrayBuffer(data);
  const encryptedBinary = await crypto.subtle.encrypt(
    { name: key.encrypt.algorithm.name },
    key.encrypt,
    plainBinary
  );
  return arrayBufferToBase64(encryptedBinary);
}

export async function decrypt(key: Types.DecryptKey, base64: string): Promise<string> {
  const encryptedBinary = base64ToArrayBuffer(base64);
  const plainBinary = await crypto.subtle.decrypt(
    { name: key.decrypt.algorithm.name },
    key.decrypt,
    encryptedBinary
  );
  return arrayBufferToString(plainBinary);
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
