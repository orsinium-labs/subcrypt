import * as C from "../src";

describe("Salt", () => {
  test("generate", async () => {
    const s1 = await C.Salt.generate();
    const s2 = await C.Salt.generate();
    expect(s1.salt !== s2.salt).toStrictEqual(true);
  });

  test("fromString", async () => {
    const s1 = await C.Salt.fromString("hello");
    const s2 = await C.Salt.fromString("hello");
    const s3 = await C.Salt.fromString("hello!");
    expect(s1.salt).toStrictEqual(s2.salt);
    expect(s2.salt !== s3.salt).toStrictEqual(true);
  });
});
