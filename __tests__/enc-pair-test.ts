import * as C from "../src";

describe("EncPair", () => {
  test("generate", async () => {
    await C.EncPair.generate();
  });

  test("decrypt", async () => {
    const key = await C.EncPair.generate();
    const dumped = await C.encrypt(key, "oh hi mark");
    const res = await C.decrypt(key, dumped);
    expect(res).toBe("oh hi mark");
  });

  test("armor", async () => {
    const key = await C.EncPair.generate();
    await C.EncPair.armor(key);
  });

  test("dearmor", async () => {
    const key1 = await C.EncPair.generate();
    const dumped1 = await C.EncPair.armor(key1);
    const key2 = await C.EncPair.dearmor(dumped1);
    const dumped2 = await C.EncPair.armor(key2);
    expect(dumped1).toBe(dumped2);
  });
});
