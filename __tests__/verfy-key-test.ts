import * as C from "../src";

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
