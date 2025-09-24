import * as C from "../src";

describe("DecryptKey", () => {
  test("armor", async () => {
    const key = await C.EncPair.generate();
    await C.DecryptKey.armor(key);
  });

  test("toSignKey", async () => {
    const key = await C.EncPair.generate();
    const dumped = await C.DecryptKey.toSignKey(key);
    await C.SignKey.armor(dumped);
  });

  test("dearmor", async () => {
    const key1 = await C.EncPair.generate();
    const dumped1 = await C.DecryptKey.armor(key1);
    const key2 = await C.DecryptKey.dearmor(dumped1);
    const dumped2 = await C.DecryptKey.armor(key2);
    expect(dumped1).toBe(dumped2);
  });
});
