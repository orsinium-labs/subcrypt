import { Buffer } from "buffer";

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("utf8");
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const b = Buffer.from(base64, "base64");
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

export function stringToArrayBuffer(binaryString: string): ArrayBuffer {
  const b = Buffer.from(binaryString, "utf8");
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
