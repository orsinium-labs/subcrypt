import { Types } from "./types";
import { arrayBufferToBase64, stringToArrayBuffer } from "./utils";

export namespace EncryptKey {
  export async function encrypt(key: Types.EncryptKey, data: string): Promise<string> {
    const plainBinary = stringToArrayBuffer(data);
    const encryptedBinary = await crypto.subtle.encrypt(
      { name: key.encrypt.algorithm.name },
      key.encrypt,
      plainBinary
    );
    return arrayBufferToBase64(encryptedBinary);
  }
}
