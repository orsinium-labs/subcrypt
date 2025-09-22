import * as C from "../src";

const SALT = C.Salt.fromArray([
  140, 96, 16, 143, 160, 106, 175, 245, 55, 36, 166, 161, 42, 253, 143, 162, 245, 168, 25,
  212, 182, 220, 70, 166, 166, 173, 167, 135, 15, 41, 125, 142, 88, 109, 168, 172, 166,
  67, 191, 236, 174, 87, 172, 163, 234, 7, 204, 64, 18, 119, 140, 22, 202, 33, 132, 43,
  34, 27, 237, 131, 95, 187, 115, 60,
]);

describe("SignKey", () => {
  test("generate", async () => {
    await C.SignKey.generate();
  });

  test("armor", async () => {
    const key = await C.SignKey.generate();
    await C.SignKey.armor(key);
  });

  test("dearmor", async () => {
    const key = await C.SignKey.generate();
    const dumped = await C.SignKey.armor(key);
    await C.SignKey.dearmor(dumped);
  });

  test("armor-dearmor-armor", async () => {
    const key1 = await C.SignKey.generate();
    const dumped1 = await C.SignKey.armor(key1);
    const key2 = await C.SignKey.dearmor(dumped1);
    const dumped2 = await C.SignKey.armor(key2);
    expect(dumped1).toBe(dumped2);
  });
});
