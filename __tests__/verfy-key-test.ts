import * as C from "../src";

const SALT = C.Salt.fromArray([
  140, 96, 16, 143, 160, 106, 175, 245, 55, 36, 166, 161, 42, 253, 143, 162, 245, 168, 25,
  212, 182, 220, 70, 166, 166, 173, 167, 135, 15, 41, 125, 142, 88, 109, 168, 172, 166,
  67, 191, 236, 174, 87, 172, 163, 234, 7, 204, 64, 18, 119, 140, 22, 202, 33, 132, 43,
  34, 27, 237, 131, 95, 187, 115, 60,
]);

describe("VerifyKey", () => {
  test("armor", async () => {
    const key = await C.SignPair.generate();
    await C.VerifyKey.armor(key);
  });

  test("dearmor", async () => {
    const key1 = await C.SignPair.generate();
    const dumped1 = await C.VerifyKey.armor(key1);
    const key2 = await C.VerifyKey.dearmor(dumped1);
    const dumped2 = await C.VerifyKey.armor(key2);
    expect(dumped1).toBe(dumped2);
  });
});
