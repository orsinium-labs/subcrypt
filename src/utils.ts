export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(arrayBufferToString(buffer));
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return stringToArrayBuffer(atob(base64));
}

export function stringToArrayBuffer(binaryString: string): ArrayBuffer {
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
