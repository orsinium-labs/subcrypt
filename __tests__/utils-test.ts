import { arrayBufferToString, stringToArrayBuffer } from "../src/utils";

describe("utils", () => {
  test("string-roundtrip-ascii", async () => {
    const a = stringToArrayBuffer("hello");
    expect(a.byteLength).toStrictEqual(5);
  });

  test("string-roundtrip-ascii", async () => {
    const a = stringToArrayBuffer("hello");
    const s = arrayBufferToString(a);
    expect(s).toStrictEqual("hello");
  });

  test("string-roundtrip-unicode", async () => {
    const a = stringToArrayBuffer("Привет, мир! 👋");
    const s = arrayBufferToString(a);
    expect(s).toStrictEqual("Привет, мир! 👋");
  });
});
