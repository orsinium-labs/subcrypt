import * as C from "../src";

describe("Salt", () => {
  test("generate", async () => {
    const s1 = await C.Salt.generate();
    const s2 = await C.Salt.generate();
    expect(s1 !== s2).toBe(true);
  });
});
