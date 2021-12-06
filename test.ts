import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { bundle } from "./mod.ts";

Deno.test("build", async () => {
  const content = await bundle("./example/app.ts");
  const filePath = await Deno.makeTempFile();
  Deno.writeTextFileSync(filePath, content);
  const result = (await import(filePath)).default;
  assertEquals(result.one, 1);
  assertEquals(result.two, 2);
});
