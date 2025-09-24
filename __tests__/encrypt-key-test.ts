import * as C from "../src";

describe("EncryptKey", () => {
  test("armor", async () => {
    const key = await C.EncPair.generate();
    await C.EncryptKey.armor(key);
  });

  test("dearmor", async () => {
    const key1 = await C.EncPair.generate();
    const dumped1 = await C.EncryptKey.armor(key1);
    const key2 = await C.EncryptKey.dearmor(dumped1);
    const dumped2 = await C.EncryptKey.armor(key2);
    expect(dumped1).toBe(dumped2);
  });
});
