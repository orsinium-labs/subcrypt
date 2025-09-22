export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function mergeArrayBuffers(abs: ArrayBufferLike[]): ArrayBuffer {
  let length = 0;
  for (const v of abs) {
    length += v.byteLength;
  }

  let merged = new Uint8Array(length);
  let offset = 0;
  for (const ab of abs) {
    const uint8view = new Uint8Array(ab, 0, ab.byteLength);
    merged.set(uint8view, offset);
    offset += uint8view.byteLength;
  }
  return merged.buffer;
}
